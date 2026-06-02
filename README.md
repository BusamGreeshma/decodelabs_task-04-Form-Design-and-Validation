# DecodeLabs Portal: Form Design & Validation

Welcome to **Project 4: Form Design & Validation** for the DecodeLabs Mastery Phase. This application is a premium, secure operator registration portal featuring a frosted-glass (glassmorphism) layout, flowing background glows, real-time programmatic validation states, and live registration completion tracking.

## 🚀 Live Demo & Deployment

This project is set up for instant hosting on **Vercel** and deployment to **GitHub**.

---

## 🎨 Design & Aesthetic Elements

- **Glassmorphic Interface**: Frosted panels built with custom transparency overlay combinations (`background: rgba(18, 20, 32, 0.65)`), subtle dynamic shadows, and web-filter blurs (`backdrop-filter: blur(20px)`).
- **Space theme Glows**: Dynamic ambient background glows that float across the interface via custom CSS `@keyframes` animations.
- **Micro-Interactions**: Smooth label movement on input focus/fill, neon green/red validation status highlights, button submit loaders, and modal popup transitions.
- **Fully Responsive**: Media queries tailor column sizes, paddings, and font sizes for a clean mobile display.

---

## 🔒 Security & Validation Controls

All validation is handled programmatically in JavaScript with real-time feedback:

1. **Full Name Verification**: Must be $\ge 3$ characters and contain only alphabetical letters, spaces, hyphens, and apostrophes.
2. **RFC Email Pattern Matching**: Validates using standard mail syntax format (`user@domain.com`).
3. **Contact Normalization**: Strips spaces, hyphens, and parenthesis, then verifies that the sanitized output contains exactly 10 digits.
4. **Specialization Selection**: Checks that a selection protocol option from the dropdown has been chosen.
5. **Real-time Password Strength**:
   - Computes a security rating ("Weak", "Fair", "Good", "Strong") as the user types.
   - Requires meeting four rules: minimum 8 characters, both uppercase and lowercase letters, at least one number, and a special symbol.
   - Highlights rules checklist items dynamically.
6. **Confirm Password Matching**: Real-time matching check against the main password field (resets dynamically if the password changes).
7. **Compliance Checks**: Verifies agreement to Terms & Conditions.
8. **Real-time Progress Indicator**: Fills a progress bar incrementally (0% to 100%) as inputs successfully pass validation rules.

---

## 📂 File Architecture

- **`index.html`**: Structure using semantic HTML5, embedded SVGs, and responsive structures.
- **`styles.css`**: Color tokens, floating labels, validation glow animations, custom checklists, checkbox overlays, and responsiveness queries.
- **`app.js`**: Event listeners, validation rules, password strength engine, and success overlay routing.

---

## 💻 Local Setup & Run

1. Clone or download the files.
2. Run a local server from the root of the project:
   ```bash
   npx serve .
   ```
3. Open the browser at the specified address (usually `http://localhost:3000`).
