# ConcertInfo.site | Concert Information Webpage

![Website Preview](https://i.imgur.com/kt0CgGx.png)

## Project Overview

ConcertInfo.site is a comprehensive concert information platform designed for music enthusiasts in Taiwan. The website aggregates key details about upcoming concerts and provides users with a convenient way to search for music events.

### Core Features

- **Latest Concert Information:** The homepage displays the most recent concert events
- **Upcoming Ticket Sales:** Shows concerts with ticket sales beginning within the next week
- **Multi-dimensional Search:** Supports filtering by city, date range, and keywords
- **Paginated Browsing:** All listing pages feature pagination for improved user experience

## Technical Implementation

### Frontend Technologies

- **Vanilla JavaScript:** Implemented with pure JavaScript without relying on frontend frameworks
- **Responsive Design:** Adapts to different devices and screen sizes
- **Modular Development:** JavaScript code separated into multiple files based on functionality
- **RESTful API Integration:** Communicates with backend API to fetch concert data

### Backend & Deployment

- **Linux Development Environment:** The backend is developed and tested in a Linux-based environment for stability and performance.
- **AWS Deployment:** The application is hosted on AWS, leveraging cloud computing resources for scalability.
- **Docker Containerization:** The backend services are containerized using Docker, ensuring consistency across different environments and simplifying deployment.


### Main Pages

1. **Home Page (index.html)**
   - Showcases the latest concert information (limited to 6 entries)
   - Lists concerts with ticket sales starting within the next week
     ![Website Preview](https://i.imgur.com/9ARRSi9.png)
2. **More Information Page (more.html)**
   - Displays all concert information with pagination
   - Shows 21 entries per page
     ![Website Preview](https://i.imgur.com/R3GYREe.png)
3. **Search Results Page (search.html)**
   - Presents keyword search results
   - Allows paginated viewing of search results
     ![Website Preview](https://i.imgur.com/1RPsT5i.png)
4. **Query Page (query.html)**
   - Filters concerts based on city and date range
   - Displays search criteria at the top of the page
     ![Website Preview](https://i.imgur.com/jjwmxUp.png)
## Feature Workflow

### City and Date Search

1. User selects a city (Taipei, New Taipei, Kaohsiung, or custom city)
2. User sets date range (start date, end date)
3. Upon clicking the search button, the page redirects to query.html with search parameters
4. System filters and displays concerts matching the specified criteria

### Keyword Search

1. User enters keywords in the search box
2. Upon clicking the search icon, the page redirects to search.html
3. System sends keyword search request to the backend API
4. Search results are presented in a paginated format

## Development Highlights

### Refined User Experience

- **Form Validation:** Ensures necessary parameters are entered before searching
- **Adaptive City Selection:** Dynamically displays input field when "Other City" option is selected
- **Chinese Character Handling:** Automatically converts "臺" to "台" for improved search accuracy
- **Scroll to Top:** Automatically scrolls to page top when navigating between pages
- **Intuitive Error Messages:** Provides friendly prompts when search yields no results

### Efficient Data Processing

- **Date Sorting:** Sorts result lists based on concert dates
- **Client-side Filtering:** Implements efficient filtering mechanisms for date and city parameters
- **Pagination Implementation:** Manages data display through server-side and client-side pagination

## Setup Instructions

1. Clone the repository
2. Set up the backend API service (separate repository)
3. Open index.html in your browser or deploy to a web server

## Future Enhancements

- Implement user accounts for saving favorite concerts
- Add concert reminder functionality
- Develop mobile application version

---

© 2025 ConcertInfo.site | Made with ♫ in Taiwan.
