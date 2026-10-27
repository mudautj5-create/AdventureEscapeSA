# Adventure Escape SA — Website Prototype

This is a **responsive HTML, CSS and JavaScript website** based on the supplied *Adventure Escape SA (Presentation).pdf* for the XHAW5112 website and mobile-application project.

## Open in Visual Studio Code

1. Extract the ZIP folder to your computer.
2. Open **Visual Studio Code**.
3. Select **File > Open Folder**, then select `AdventureEscapeSA-Website`.
4. Open `index.html`.
5. For a browser preview, right-click `index.html` and select **Open with Live Server** if you have the optional Live Server extension installed, **or** open `index.html` directly in Chrome/Edge. A development server is **not** required.

You can also use **Visual Studio** on Windows: select **File > Open > Folder** and select the extracted folder, then open `index.html` in a browser.

## What the website includes

- Home page with a branded hero, featured packages, activities and discount announcement.
- About page with the scenario's founder, founding year, business background, mission, vision and goals.
- Filterable, searchable listing of **four** adventure packages at **R1,500** each, matching the demonstration screenshots.
- **Three** individual activity cards at **R750** each, matching the demonstration screenshots.
- Details for every package and activity, with images, descriptions and inclusions.
- Cart/booking selection: add a package or activity, increase/decrease quantity, or remove it.
- Automatic discounts: **2 selections = 5%**, **3 = 10%**, **4 or more = 15%**.
- **15% VAT** applied to the subtotal **after** the discount.
- Customer-information fields, form validation, and an instant **sample quote** that can be downloaded as a `.txt` file.
- Contact page with a local-only form preview and Western Cape operating-area illustration.
- Responsive desktop/tablet/mobile layouts; fixed quick navigation on phones.
- Browser storage of **booking selections only** (`localStorage`) so selections persist on refresh.

### Discount example

Two R1,500 packages:

- Subtotal: R3,000.00
- Discount (5%): −R150.00
- After discount: R2,850.00
- VAT (15%): R427.50
- **Estimated total: R3,277.50**

## Folder structure

```
AdventureEscapeSA-Website/
├── index.html          Main HTML entry point
├── css/
│   └── styles.css      Responsive design / brand colours
├── js/
│   ├── data.js         Package and activity catalogue
│   └── app.js          Navigation, filtering, cart, VAT and quote logic
├── assets/             Logo and outdoor image crops from the presentation
└── README.md           These setup instructions
```

## Where to edit the project

- **Packages, activities, descriptions and sample prices:** edit `js/data.js`.
- **Colours, fonts, spacing and layout:** edit `css/styles.css`.
- **Page content and interactions:** edit `js/app.js`.
- **Branding, navigation and footer:** edit `index.html`.

### Brand colours from the presentation

| Name | Hex |
| --- | --- |
| Forest Green | `#184C35` |
| Pine Green | `#3A7C5B` |
| Sun Gold | `#F1CD52` |
| Sky Blue | `#70B4DD` |
| River Blue | `#2984BB` |

## Important limitations (student prototype)

**This site does not make real reservations, send customer enquiries, send emails, charge payments, or create invoices.** Generating a quote is a local calculation and optional file download. Customer details are not uploaded or saved as part of the quote; only the product-selection list is saved locally.

The supplied presentation states that the company works across Western Cape venues but **does not provide verified physical venue addresses, company email, phone number or social accounts**. These have deliberately **not been invented**. The contact page uses a labelled region illustration, not a falsely claimed venue pin. A real business deployment would need confirmed venue details, a server or trusted form provider, secure data handling, policy pages, and testing.

The supplied logo and image crops were taken from the user-provided presentation. Replace low-resolution photos with original/licensed higher-resolution media before publishing a real commercial website.

The Google Fonts import in `styles.css` is optional. It will use system fonts when offline. All main images, styling and JavaScript are bundled and work offline.

## Suggested presentation demo

1. Open the Home page and explain the brand colours and responsive navigation.
2. Open **Packages**, try the Family filter, and select a package detail.
3. Click **Add to my booking**, add other selections, then open **Calculate Fees**.
4. Demonstrate how the **5% / 10% / 15% discount** changes as quantity changes.
5. Show that **15% VAT** is applied after the discount.
6. Fill out the demo customer form, generate a sample quote, and download it.
7. Open the **Contact** page and explain which functions would require a backend in production.

*Created as a practical website demonstration based on XHAW5112 Adventure Escape SA materials.*
