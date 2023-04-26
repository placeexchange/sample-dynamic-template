# sample-dynamic-template

This repo provides a representative sample of a templated HTML5 dynamic creative that can run via Place Exchange. The sample template will dynamically render based on geolocation (a `lat/lon` pair) and the time of day, and it is intended to be used as an illustrative development guide.

This repo also contains a "base" template that can be used as a starting point for template development in accordance with Place Exchange's dynamic template spec. 

The sample template can render as follows; this specific sample template is currently intended to be rendered with a 16:9 aspect ratio, but templates can be developed for any aspect ratios or dimensions that the creatives should run on.

<img width="672" alt="Screen Shot 2022-04-27 at 1 46 03 PM" src="https://user-images.githubusercontent.com/63798055/165587939-402420e4-b599-4a9d-ac7a-02679a8d4c20.png">

# Contents

1. [Template Overview](#template-overview)
2. [Developing a Dynamic Template](#developing-a-dynamic-template)
    1. [Template Limitations](#template-limitations)
3. [Packaging a Dynamic Template](#packaging-a-dynamic-template)
4. [Activating a Dynamic Template](#activating-a-dynamic-template)
5. [Supported Template Variables](#supported-template-variables)
    1. [Potential Future Template Variables](#potential-future-template-variables)

## Template Overview

The sample template is developed as HTML bundled with CSS/JS and assets, all viewable in the `src` directory.
* `src/index.html` is the HTML creative intended to be rendered and contains references to corresponding CSS/JS.
* When fulfilling publisher requests, PX may render a snapshot of the HTML dynamic creative (as a JPEG) to be used in adserving, or the publisher can request the HTML directly and render the HTML on their screens.
* These creatives can *optionally* utilize macros (template variables), for which PX can inject dynamic values when fulfilling requests. This allows the HTML creative to be enriched with contextual data before rendering; please see below for the full list of supported template variables. This sample creative uses renders based on injected `lat/lon` values.

To view the sample template, simply run `open src/index.html`.
* While the sample template uses template variables, it uses fallback default values if template variables are not dynamically replaced.
* Please bear in mind this template is intended to be rendered with a 16:9 aspect ratio, so ensure your browser dimensions are as such to properly view the sample creative.

To test the sample creative, simply run `npm install` and `npm test` in the root directory.
## Developing a Dynamic Template

This repository provides a sample template (at `src/index.html`) that can be used as an illustrative reference for how a dynamic template can be prepared for execution with Place Exchange.

Additionally, a base template (at `base.html`) can be used as a starting point for development of a dynamic creative template. This base template contains the full list of supported template variables; developers may select whichever variables are needed for a given use case.

If the template has external dependencies, PX recommends using default fallback content in case any of the external dependencies fail (e.g., cannot connect to the internet, API services are unavailable). That way, an appropriate default creative can still be reliably displayed in the event of an dependency failure.

### Template Limitations
Please bear in mind the following limitations:

* Snapshots of any dynamic templates will be rendered 500ms after the HTML begins loading. This means if the dynamic template has external dependencies (e.g. API calls to fetch content), the ***additional work must be completed within 500ms*** or else it may not be reflected in the rendered snapshot. We recommend templates load and render within <250ms, including calls to external APIs.
* Snapshots may be cached and re-used for up to an hour (subject to change). This means a rendered snapshot may be close to *near*, but not, real-time - it may not be perfectly up-to-date to the minute/second.
* Only the template variables explicitly denoted in this spec are supported for replacement.

## Packaging a Dynamic Template

Dynamic templates should be packaged as a .zip file that contains an `index.html` file at its root; these .zip files will be uploaded to Place Exchange. When serving the creative, Place Exchange will attempt to render the `index.html` file, utilizing any additional resources that the `index.html` references.

An example .zip file may be packaged as follows:

```
|--assets
|   |--icon-1.png
|   |--logo.png
|--index.html
|--index.js
|--styles.css
```

We recommend that all **static** resources (JS, CSS, images) should be provided as part of the .zip file package, and the `index.html` should require these files directly as opposed to downloading any resources from the internet. This is to minimize network traffic and ensure that creatives are ready to be rendered within 500ms. Static resources can be provided in any directory structure within the .zip file; any references to / imports of these resources should be done with relative filepaths.

Packages should be <500kb in size.

## Activating a Dynamic Template

Once a dynamic template is ready and packaged, please reach out to Place Exchange to activate the dynamic template. Email the .zip package to adops@placeexchange.com; our team will coordinate with publishers to review and approve the template. Afterwards, we will be in touch to coordinate campaign setup and activation.

## Supported Template Variables

PX currently supports a fixed set of template variables (macros) that can be dynamically replaced on templated HTML creatives before the creative is rendered. These can optionally be used as contextual data / triggers for rendering creatives.

Using template variables is not required if your HTML5 creative will render as desired without additional context.

In order to use these template variables, please include the variables where you expect Place Exchange to inject any contextual data / triggers.

| Template Variable | Description | Type |
------------------- | ----------- | ---- |
| $!{lat} | The latitude of the publisher's device where the ad will be displayed. | number |
| $!{lon} | The longitude of the publisher's device where the ad will be displayed. | number |
| $!{region} | DMA region of the publisher's device where the ad will be displayed. | string |
| $!{dma_code} | DMA code of the publisher's device where the ad will be displayed. | number |
| $!{country} | Country of the publisher's device where the ad will be displayed. | string |

Any template variables used must be part of this list. If any other variables are used or are spelled incorrectly, PX will not be able to replace the variable with desired data.

### Potential Future Template Variables

The following template variables may be supported in the future; if you have additional variables you are interested in leveraging, please reach out to Place Exchange to see if we may support them:

| Potential Template Variable | Description |
----------------------------- | ------------- |
| ${postal_code} | The postal code of the publisher's device where the ad will be displayed. |