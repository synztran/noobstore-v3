# reCAPTCHA v4 Integration Setup Guide

This guide explains how to configure and use reCAPTCHA v4 in your NoobStore web application.

## 🚀 Quick Setup

### 1. Get reCAPTCHA Keys

1. Go to [Google reCAPTCHA Admin Console](https://www.google.com/recaptcha/admin/create)
2. Create a new site with reCAPTCHA v3/v4
3. Add your domain(s) to the allowed domains list
4. Copy your **Site Key** and **Secret Key**

### 2. Environment Variables

Add these environment variables to your `.env.local` file:

```bash
# Public site key (used in client-side code)
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your_recaptcha_site_key_here

# Secret key (used for server-side validation - keep this secure!)
RECAPTCHA_SECRET_KEY=your_recaptcha_secret_key_here

# Optional: Minimum score threshold (0.0 to 1.0, default: 0.5)
RECAPTCHA_MIN_SCORE=0.5
```

### 3. Verify Integration

The reCAPTCHA integration is already implemented in these forms:

-   ✅ **Checkout Form** (`/checkout`)
-   ✅ **Service Booking** (`/services`)
-   ✅ **Product Posting** (Seller Modal)
-   ✅ **Raffle Entry** (Raffle Modal)

## 🔧 How It Works

### Client-Side Integration

The application uses an invisible reCAPTCHA approach:

1. **Automatic Token Generation**: When users submit forms, a reCAPTCHA token is automatically generated
2. **User-Friendly**: No visible CAPTCHA challenges for legitimate users
3. **Error Handling**: Clear error messages if reCAPTCHA fails

### Components Used

-   `useRecaptcha` hook for token management
-   `RecaptchaWrapper` component for easy integration
-   `InvisibleRecaptcha` component for seamless user experience

## 📝 Implementation Details

### Form Integration Pattern

Each form follows this pattern:

```typescript
const handleSubmit = async (formData) => {
	// Get reCAPTCHA token
	const recaptchaToken = await getRecaptchaToken(
		process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY,
		"form_action_name"
	);

	if (!recaptchaToken) {
		// Handle error
		return;
	}

	// Submit form with token
	const response = await submitForm({
		...formData,
		recaptchaToken,
	});
};
```

### Server-Side Validation

Use the provided utility functions:

```typescript
import { validateRecaptchaToken } from "@/utils/recaptchaUtils";

const isValid = await validateRecaptchaToken(
	token,
	process.env.RECAPTCHA_SECRET_KEY,
	"expected_action",
	0.5 // minimum score
);
```

## 🛡️ Security Features

-   **Score-Based Protection**: reCAPTCHA v4 provides scores (0.0-1.0) indicating bot likelihood
-   **Action Verification**: Each form has a specific action name for validation
-   **Token Expiration**: Tokens automatically expire for security
-   **Error Handling**: Comprehensive error handling with user-friendly messages

## 🔍 Troubleshooting

### Common Issues

1. **"reCAPTCHA not loaded" Error**

    - Check if `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` is set correctly
    - Verify the domain is added to reCAPTCHA console

2. **Low Score Rejections**

    - Adjust `RECAPTCHA_MIN_SCORE` (lower = less strict)
    - Check for bot-like behavior patterns

3. **Network Errors**
    - Verify internet connection
    - Check if Google reCAPTCHA API is accessible

### Debug Mode

To enable debug logging, add this to your browser console:

```javascript
localStorage.setItem("recaptcha_debug", "true");
```

## 📊 Monitoring

Monitor reCAPTCHA performance in the Google reCAPTCHA Admin Console:

-   View traffic analytics
-   Monitor score distributions
-   Check for suspicious activity
-   Adjust settings as needed

## 🔄 Updates and Maintenance

-   Regularly check the reCAPTCHA console for alerts
-   Monitor application logs for reCAPTCHA errors
-   Update minimum score thresholds based on traffic patterns
-   Keep the integration updated with the latest reCAPTCHA features

## 🆘 Support

For issues with this integration:

1. Check the browser console for error messages
2. Verify environment variables are set correctly
3. Test with different browsers and devices
4. Check Google reCAPTCHA service status

For reCAPTCHA-specific issues, consult the [official documentation](https://developers.google.com/recaptcha).
