# Legal Sales Target App
This project aims to help Clio's sales and marketing by offering a specialized, client-focused tool to discover potential clients, gain valuable insights about them, and effectively promote Clio.

Using a microservice architecture, the web application features an intuitive, map-based interface that allows users to easily explore and target law firms either in their vicinity or within any specific region of interest. Once a firm is selected, the app uses AI to summarize firm websites and give users all the information they need to know about the place. The good thing about this is that it doesn't have to be law firms! This app can be catered towards any business type (ex: doctors, parks, attractions, etc.) and it will always provide users with real-time data.

### The app also goes a step further by:
- Assessing the probability that a particular law firm will become a Clio client.
- Creating customized messages that highlight how Clio’s software and services can support the specific needs of the law firm, considering their practice areas and operational style.
- Developing promotional content and tailored pitches/proposals for each law firm.
- Sending templated or AI-generated emails to the selected law firm to promote Clio or notify them of any updates

## Tech Stack
### Tools, Frameworks, Databases, Languages:
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB) ![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white) ![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white) ![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white) ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black) ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white) ![Web Scraping](https://img.shields.io/badge/Web_Scraping-4285F4?style=for-the-badge&logo=web&logoColor=white)

### Services:
![Google Cloud Platform](https://img.shields.io/badge/Google_Cloud-4285F4?style=for-the-badge&logo=google-cloud&logoColor=white) ![Google Maps API](https://img.shields.io/badge/Google_Maps_API-4285F4?style=for-the-badge&logo=google-maps&logoColor=white) ![Microsoft Azure](https://img.shields.io/badge/Microsoft_Azure-0078D4?style=for-the-badge&logo=microsoft-azure&logoColor=white) ![OpenAI](https://img.shields.io/badge/OpenAI-412991?style=for-the-badge&logo=openai&logoColor=white) ![EmailJS](https://img.shields.io/badge/EmailJS-67C8FF?style=for-the-badge&logo=emailjs&logoColor=white)

## High-Level Diagram
<img src="frontend/src/assets/LegalSalesTarget-Diagram.png" alt="High Level Diagram" width="800"/>

## How this project was built
- Google Maps API: Integrated for map processing and locating law firms.
- Google Cloud Platform (GCP): Provides law firm data, including main website, address, rating, image, operational hours, and more.
- Web Scraping: Used to retrieve contact information from each law firm's main website (of course ensuring confidentiality if certain sites do not permit this access).
- Microsoft Azure: Used as a secondary source for law firm images if GCP does not have it.
- MongoDB: Stores user data for login, signup, and authentication. The database is hosted on an Microsoft Azure server, and passwords are encrypted.
- OpenAI API to get:
    - Summaries of each law firm (including their practice areas, strenghts, potential challenges, and more).
    - The likelihood of the firm becoming Clio's client (in percentage).
    - How Clio's services/software can specifically help/address the law firm's business needs.
    - Personalized pitch for promoting Clio to the law firm.
- EmailJS: Enables sending emails, allowing users to send a pre-made Clio template, a custom message, or an AI-generated pitch to the law firm. Users can also adjust the recipient's email address as needed.
- React: frontend
- Node: backend
- Express: Creates endpoints to connect the frontend to the backend.
- TailwindCSS: Utility-first CSS framework that makes the styling process in React easier.

## Challenges


## Running the app
- Run: `npm start` in the root directory

## Thank you to the following Clions for their valuable insights on Clio's sales teams:
- Scott Adema
- Cole Hecht
- Sahel Hatam
- Molly Ariunbold

## Images
