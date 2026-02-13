# Development Tasklist

## Phase 1: Foundation 
- [x] Initial HTML structure and Hero section.
- [x] Define CSS variables for #0C610A and #FFEF16.
- [x] Move internal CSS to an external `/css/style.css` file.
- [x] Create a custom favicon using the VPOWER logo.

## Phase 2: Content & Gallery 
- [x] **Gallery:** Implement a "Lightbox" effect (click to enlarge product photos).
- [x] **Gallery:** Add "Hover" states to show product prices or "Quick View" options.
- [x] **Mission:** Draft the "About the Founder" copy for the mission section.
- [ ] **Assets:** Optimize all product images to WebP format for faster loading.

## Phase 3: SEO & Engagement 
- [x] **Metadata:** Add `<meta>` descriptions and Open Graph tags for social sharing.
- [x] **Blog:** Create a `blog-template.html` for "Behind the Craft" stories.
- [x] **Footer:** Add links to Instagram, Pinterest, and Facebook.
- [x] **Contact:** Build a simple inquiry form for custom order requests.
- [x] **Services:** Add professional installation services section.

## Phase 4: E-commerce Integration 
- [x] Connect "Shop Now" buttons to a payment gateway (Stripe/PayPal) or Shopify Lite.
- [x] Add a "Cart" icon to the navigation bar.
- [x] Implement full shopping cart functionality.

## Phase 5: Testing & Refinement 
- [ ] **Navigation Consistency:** Update blog and contact page navigation to match main site
- [ ] **Mobile Testing:** Test responsiveness on iPhone and Android mobile browsers.
- [ ] **Feature Testing:** Test cart, lightbox, and contact form functionality
- [ ] **Accessibility:** Check color contrast and add ARIA labels
- [ ] **Error Handling:** Implement cart and form error handling
- [ ] **Performance:** Optimize images and add loading states
- [ ] **Validation:** Validate HTML for W3C compliance.

## Phase 6: Backend Integration (Optional) 
- [ ] **Contact Form Backend:** Connect contact form to email service (SendGrid/Mailgun)
- [ ] **Order Management:** Simple database for tracking service inquiries
- [ ] **Appointment Scheduling:** Calendar integration for service bookings
- [ ] **Analytics:** Google Analytics and conversion tracking

## Backend Requirements Assessment:
**Current Status:** Frontend is fully functional without backend
**Needed For:**
- Email notifications from contact form (currently shows success message only)
- Professional appointment scheduling system
- Order/inquiry tracking system
- Analytics and reporting

**Recommendation:** Start with frontend testing and refinement. Backend can be added later as business grows.