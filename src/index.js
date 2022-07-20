const fetchStudioData = async () => {
    const origin = `${LONGITUDE},${LATITUDE}`
    const res = await fetch(`${BASE_URL}/api/v1/places?origin=${origin}&radius=${RADIUS}&sports=${SPORTS}&limit=${LIMIT}`);
    const body = await res.json();
    return body.data.features;
}

const createStudioItem = (studio) => {
    const studioItem = document.createElement('div');
    studioItem.className = 'studio-item-container';

    const studioName = document.createElement('h2');
    studioName.innerText = studio.properties.name;
    studioName.className = 'studio-name';
    studioItem.appendChild(studioName);

    const studioDetails = document.createElement('div');
    studioDetails.className = 'studio-details-container';

    const addressContainer = document.createElement('div');
    addressContainer.className = 'address-container';
    const addressComponents = studio.properties.address_components;
    const streetAddress = document.createElement('p');
    const cityStatePostal = document.createElement('p');
    streetAddress.innerText = addressComponents.address;
    streetAddress.className = 'street-address';
    cityStatePostal.innerText = `${addressComponents.city}, ${addressComponents.province}, ${addressComponents.postal_code}`;
    cityStatePostal.className = 'city-state-postal';
    addressContainer.appendChild(streetAddress);
    addressContainer.appendChild(cityStatePostal);
    studioDetails.append(addressContainer);

    const proximityContainer = document.createElement('div');
    proximityContainer.className = 'proximity-container';

    const walkIcon = document.createElement('img');
    walkIcon.src = 'https://pxba-px-mabe-dynamicsnapshots.s3.amazonaws.com/dynamic-test/assets/one-man-walking.png';
    walkIcon.className = 'walk-icon';
    proximityContainer.appendChild(walkIcon);

    const studioProximity = document.createElement('p');
    studioProximity.innerText = `${(studio.properties.proximity * 0.62137).toFixed(2)} miles away`;  // converts km to miles
    studioProximity.className = 'proximity-text';

    proximityContainer.appendChild(studioProximity);
    studioDetails.appendChild(proximityContainer);

    studioItem.appendChild(studioDetails);

    return studioItem;
}

const createStudioContentContainer = (studios) => {
    const studioContentContainer = document.createElement('div');
    studioContentContainer.className = 'studio-content-container';

    const studioGreeting = document.createElement('h1');
    studioGreeting.innerText = 'Looking for a yoga studio? Try one nearby!';
    studioContentContainer.appendChild(studioGreeting);

    const studioListContainer = document.createElement('div');
    studioListContainer.className = 'studio-list-container';

    for (const studio of studios) {
        studioItem = createStudioItem(studio);
        studioListContainer.appendChild(studioItem);
    }

    studioContentContainer.appendChild(studioListContainer);
    return studioContentContainer;
}

const createDefaultContainer = () => {
    const defaultContainer = document.createElement('div');
    defaultContainer.className = 'default-content-container';

    const defaultText = document.createElement('h1');
    defaultText.className = 'default-text';
    defaultText.innerText = 'Sorry, no yoga studios found nearby.'
    defaultContainer.appendChild(defaultText);

    const mainContainer = document.querySelector('.main-container');
    mainContainer.appendChild(defaultContainer);
}

const setStudioData = async () => {
    let studios;
    try {
        studios = await fetchStudioData();
    } catch {
        createDefaultContainer();
        return;
    }

    if (!studios.length) {
        createDefaultContainer();
        return;
    };

    const studioContentContainer = createStudioContentContainer(studios);
    const mainContainer = document.querySelector('.main-container');
    mainContainer.appendChild(studioContentContainer);
}

const setLastUpdated = () => {
    const lastUpdated = document.createElement('p');
    lastUpdated.innerText = `Sample Dynamic Template generated at:\n ${new Date()}`
    lastUpdated.className = 'last-update-text';
    const lastUpdatedContainer = document.querySelector('.last-update-container');
    lastUpdatedContainer.appendChild(lastUpdated);
}

const getContent = () => {
    setLastUpdated();
    setStudioData();
}

document.addEventListener('DOMContentLoaded', getContent);