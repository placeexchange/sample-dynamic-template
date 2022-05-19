const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');

const ORIGINAL_HTML_PATH = path.resolve(__dirname, "../src/index.html");

describe("sample PX dynamic template", () => {

    let dom;
    const renderCreative = async (HTMLFileToRender) => {
        const options = {
            runScripts: "dangerously",
            resources: "usable"
        };
        dom = await JSDOM.fromFile(HTMLFileToRender, options);

        // JSDOM does not implement fetch, but can provide a mocked implementation here
        // see: https://github.com/jsdom/jsdom/issues/1724
        dom.window.fetch = jest.fn(() => {
            return Promise.resolve({
                json: () => Promise.resolve({ data: {
                    features: [
                        {
                            properties: {
                                name: 'studio-1',
                                address_components: {
                                    address: '100 Broadway',
                                    city: 'New York',
                                    province: 'New York',
                                    postal_code: '10005'
                                },
                                proximity: 1.53
                            }
                        },
                        {
                            properties: {
                                name: 'studio-2',
                                address_components: {
                                    address: '500 Broadway',
                                    city: 'New York',
                                    province: 'New York',
                                    postal_code: '10004'
                                },
                                proximity: 2.53
                            }
                        },
                        {
                            properties: {
                                name: 'studio-3',
                                address_components: {
                                    address: '900 Broadway',
                                    city: 'New York',
                                    province: 'New York',
                                    postal_code: '10003'
                                },
                                proximity: 4.12
                            }
                        }
                    ]
                }
            })})
        });

        // wait for scripts to run
        // TODO: implement a hook to detect when scripts are completed
        await new Promise((resolve) => setTimeout(resolve, 500));
    };

    describe("variable replacement", () => {
        test("replaced variables are used for API call", async () => {
            const originalHTML = fs.readFileSync(ORIGINAL_HTML_PATH, 'utf8');
            
            const resp_b64 = Buffer.from(JSON.stringify({
                lat: 50,
                lon: 60
            })).toString('base64');
            const replacedHTML = originalHTML.replace('"{{ resp_b64 }}"', `"${resp_b64}"`);

            const HTMLFileToRender = path.resolve(__dirname, "../src/replaced.html");
            fs.writeFileSync(HTMLFileToRender, replacedHTML);

            await renderCreative(HTMLFileToRender)

            expect(dom.window.fetch).toHaveBeenCalledWith("https://sportplaces.api.decathlon.com/api/v1/places?origin=60,50&radius=5&sports=292&limit=3");
            fs.unlinkSync(HTMLFileToRender);
        });

        test("default variables are used if no variables are replaced", async () => {
            await renderCreative(ORIGINAL_HTML_PATH);
            expect(dom.window.fetch).toHaveBeenCalledWith("https://sportplaces.api.decathlon.com/api/v1/places?origin=-73.95655633519236,40.67567825655293&radius=5&sports=292&limit=3");
        });
    });

    describe("dynamic creative rendering", () => {
        beforeAll(async () => {
            await renderCreative(ORIGINAL_HTML_PATH);
        })

        test("yoga studio details render correctly", () => {
            const document = dom.window.document;

            const names = document.querySelectorAll('.studio-name');
            expect(names[0].innerText).toEqual('studio-1');
            expect(names[1].innerText).toEqual('studio-2');
            expect(names[2].innerText).toEqual('studio-3');

            const addresses = document.querySelectorAll('.street-address')
            expect(addresses[0].innerText).toEqual('100 Broadway');
            expect(addresses[1].innerText).toEqual('500 Broadway');
            expect(addresses[2].innerText).toEqual('900 Broadway');

            const cityStatePostal = document.querySelectorAll('.city-state-postal');
            expect(cityStatePostal[0].innerText).toEqual('New York, New York, 10005')
            expect(cityStatePostal[1].innerText).toEqual('New York, New York, 10004')
            expect(cityStatePostal[2].innerText).toEqual('New York, New York, 10003')

            const proximities = document.querySelectorAll('.proximity-text');
            expect(proximities[0].innerText).toEqual(`${(1.53 * 0.62137).toFixed(2)} miles away`);
            expect(proximities[1].innerText).toEqual(`${(2.53 * 0.62137).toFixed(2)} miles away`);
            expect(proximities[2].innerText).toEqual(`${(4.12 * 0.62137).toFixed(2)} miles away`);
        });

        test("last updated timestamp updates correctly", () => {
            const document = dom.window.document;
            const lastUpdatedText = document.querySelector('.last-update-text').innerText;

            const staticText = lastUpdatedText.slice(0, lastUpdatedText.indexOf('\n'));
            expect(staticText).toEqual('Sample Dynamic Template generated at:');

            const dateText = lastUpdatedText.slice(lastUpdatedText.indexOf('\n') + 2);
            const renderDate = new Date(dateText);
            const currentDate = new Date();
            expect(renderDate.getHours()).toEqual(currentDate.getHours());
            expect(renderDate.getDate()).toEqual(currentDate.getDate());
            expect(renderDate.getMonth()).toEqual(currentDate.getMonth());
            expect(renderDate.getYear()).toEqual(currentDate.getYear());
        });
    });
});
