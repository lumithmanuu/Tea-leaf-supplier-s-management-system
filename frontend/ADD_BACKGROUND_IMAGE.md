# Adding the Tea Leaves Background Image

The authentication pages (login and signup) are configured to use a tea leaves background image.

## Steps to Add the Image

1. **Save the tea leaves image** you uploaded as `tea-leaves-bg.jpg`
2. **Place it in the `public` folder** at:
   ```
   /Users/lumithmanujaya/Desktop/Tea leaf management system/frontend/public/tea-leaves-bg.jpg
   ```

The image will automatically be used as the background for:
- Login page (`/login` or default)
- Signup page (`/signup`)

## Image Specifications

- **Filename:** `tea-leaves-bg.jpg`
- **Location:** `/frontend/public/tea-leaves-bg.jpg`
- **Recommended size:** 1920x1080px or larger (for high quality on desktop)
- **Format:** JPG or PNG

The CSS will automatically:
- Apply a dark overlay (brightness filter) for readability
- Add blur effect for subtle appearance
- Use fixed background attachment for parallax effect
- Provide a fallback gradient if the image fails to load

## Current Status

✅ Authentication pages created
✅ Login form implemented
✅ Signup form implemented
✅ Auth CSS styling complete
✅ Auth utilities created
✅ App routing configured

⏳ **Pending:** Add `tea-leaves-bg.jpg` to the public folder

## File Structure
```
frontend/
├── public/
│   ├── favicon.svg
│   ├── icons.svg
│   └── tea-leaves-bg.jpg  ← Add here
├── src/
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Signup.jsx
│   │   └── ...
│   ├── auth.css
│   └── ...
```

Once you add the image, simply refresh the browser and you'll see it in the background!
