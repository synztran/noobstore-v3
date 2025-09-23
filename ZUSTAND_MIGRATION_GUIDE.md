# Zustand Migration Guide

## Overview

This guide explains how to migrate from the `useServicePage` custom hook to the enhanced Zustand store in `useServices.ts`.

## What Changed

### ✅ Enhanced Zustand Store

The `useServices` store now includes all functionality from `useServicePage`:

-   Service plan selection
-   Keyboard, Switch, and Stabilizer service management
-   Contact and shipping information
-   Form validation and submission
-   Price calculation
-   Backend data formatting

### ✅ Maintained Structure

Your existing Zustand pattern is preserved:

-   **States**: All state variables
-   **Actions**: All state mutations and business logic
-   **Selectors**: Easy access to computed values

## Migration Steps

### 1. Import Changes

**Before (useServicePage):**

```typescript
import useServicePage from "@/hook/useServicePage";
```

**After (Enhanced Zustand):**

```typescript
import useServices, {
	useServiceAction,
	useServiceSelectors,
} from "@/zustand/useServices";
```

### 2. Hook Usage Changes

**Before (useServicePage):**

```typescript
const {
	selectedPlan,
	keyboardServices,
	switchServices,
	totalPrice,
	selectPlan,
	addKeyboardService,
	updateKeyboardService,
	validateForm,
	submitServiceBooking,
} = useServicePage();
```

**After (Enhanced Zustand):**

```typescript
// Option 1: Direct access (for simple cases)
const { selectedPlan, keyboardItems, switchItems } = useServices();
const { selectPlan, addKeyboardItem, updateKeyboardItem } = useServiceAction();

// Option 2: Using selectors (recommended for computed values)
const { selectedPlan, keyboardItems, switchItems, totalPrice, isFormValid } =
	useServiceSelectors();
const {
	selectPlan,
	addKeyboardItem,
	updateKeyboardItem,
	validateForm,
	submitServiceBooking,
} = useServiceAction();
```

### 3. Property Name Changes

| useServicePage          | Enhanced Zustand        | Notes                       |
| ----------------------- | ----------------------- | --------------------------- |
| `keyboardServices`      | `keyboardItems`         | More consistent naming      |
| `switchServices`        | `switchItems`           | More consistent naming      |
| `stabilizerServices`    | `stabilizerItems`       | More consistent naming      |
| `addKeyboardService`    | `addKeyboardItem`       | Consistent with item naming |
| `updateShippingInfo`    | `updateShippingInfo`    | ✅ Same                     |
| `updateContactInfo`     | `updateContactInfo`     | ✅ Same                     |
| `calculateTotalPrice()` | `calculateTotalPrice()` | Now in actions              |

## Example Migrations

### Example 1: Service Plan Selection Component

**Before:**

```typescript
const ServicePlanSelector = () => {
  const { selectedPlan, selectPlan } = useServicePage();

  return (
    <div>
      {plans.map(plan => (
        <button
          key={plan.value}
          className={selectedPlan?.value === plan.value ? 'selected' : ''}
          onClick={() => selectPlan(plan)}
        >
          {plan.name}
        </button>
      ))}
    </div>
  );
};
```

**After:**

```typescript
const ServicePlanSelector = () => {
  const { selectedPlan } = useServices();
  const { selectPlan } = useServiceAction();

  return (
    <div>
      {plans.map(plan => (
        <button
          key={plan.value}
          className={selectedPlan?.value === plan.value ? 'selected' : ''}
          onClick={() => selectPlan(plan)}
        >
          {plan.name}
        </button>
      ))}
    </div>
  );
};
```

### Example 2: Service Items Management

**Before:**

```typescript
const KeyboardServiceForm = () => {
  const {
    keyboardServices,
    addKeyboardService,
    updateKeyboardService,
    removeKeyboardService
  } = useServicePage();

  return (
    <div>
      {keyboardServices.map(keyboard => (
        <div key={keyboard.id}>
          <input
            value={keyboard.keyboardName}
            onChange={(e) => updateKeyboardService(keyboard.id, {
              keyboardName: e.target.value
            })}
          />
          <button onClick={() => removeKeyboardService(keyboard.id)}>
            Remove
          </button>
        </div>
      ))}
      <button onClick={addKeyboardService}>Add Keyboard</button>
    </div>
  );
};
```

**After:**

```typescript
const KeyboardServiceForm = () => {
  const { keyboardItems } = useServices();
  const {
    addKeyboardItem,
    updateKeyboardItem,
    removeKeyboardItem
  } = useServiceAction();

  return (
    <div>
      {keyboardItems.map(keyboard => (
        <div key={keyboard.id}>
          <input
            value={keyboard.keyboardName}
            onChange={(e) => updateKeyboardItem(keyboard.id, {
              keyboardName: e.target.value
            })}
          />
          <button onClick={() => removeKeyboardItem(keyboard.id)}>
            Remove
          </button>
        </div>
      ))}
      <button onClick={addKeyboardItem}>Add Keyboard</button>
    </div>
  );
};
```

### Example 3: Form Submission

**Before:**

```typescript
const ServiceForm = () => {
  const {
    validateForm,
    submitServiceBooking,
    resetForm,
    totalPrice
  } = useServicePage();

  const handleSubmit = async () => {
    const errors = validateForm();
    if (errors.length > 0) {
      alert('Please fix: ' + errors.join(', '));
      return;
    }

    try {
      await submitServiceBooking();
      alert('Success!');
      resetForm();
    } catch (error) {
      alert('Error occurred');
    }
  };

  return (
    <div>
      <div>Total: ${totalPrice}</div>
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
};
```

**After:**

```typescript
const ServiceForm = () => {
  const { totalPrice } = useServiceSelectors();
  const {
    validateForm,
    submitServiceBooking,
    resetForm
  } = useServiceAction();

  const handleSubmit = async () => {
    const errors = validateForm();
    if (errors.length > 0) {
      alert('Please fix: ' + errors.join(', '));
      return;
    }

    try {
      await submitServiceBooking();
      alert('Success!');
      resetForm();
    } catch (error) {
      alert('Error occurred');
    }
  };

  return (
    <div>
      <div>Total: ${totalPrice}</div>
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
};
```

## Benefits of Migration

### ✅ **Global State Management**

-   State persists across component unmounts
-   Share state between distant components
-   Better for multi-step forms

### ✅ **Improved Performance**

-   Only re-render components that use changed state slices
-   Avoid unnecessary re-renders from large state objects
-   Better optimization opportunities

### ✅ **Enhanced Developer Experience**

-   Zustand DevTools integration
-   Time-travel debugging
-   Better state inspection

### ✅ **Backward Compatibility**

-   Legacy `selectedOpt` and `serviceForm` still work
-   Gradual migration possible
-   No breaking changes for existing components

## Legacy Support

The enhanced store maintains backward compatibility:

```typescript
// ✅ Legacy usage still works
const { selectedOpt } = useServices();
const { updateSelectedOpt } = useServiceAction();

// ✅ New usage recommended
const { selectedPlan } = useServices();
const { selectPlan } = useServiceAction();
```

## Next Steps

1. **Start with new components**: Use the enhanced Zustand store for new features
2. **Gradual migration**: Update existing components one by one
3. **Remove useServicePage**: Once all components are migrated, remove the old hook
4. **Add persistence**: Consider adding Zustand persistence middleware for form data

## Need Help?

If you encounter issues during migration:

1. Check the property name mapping table above
2. Use TypeScript to catch renamed properties
3. Test with existing components to ensure compatibility
4. The legacy support ensures gradual migration is safe
