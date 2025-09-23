# useServicePage Hook Documentation

## Overview

The `useServicePage` hook is a comprehensive, simplified solution that combines the functionality of the previous `useServices` and `useSelectedOption` hooks. It provides a unified state management system for the service page, making it easier to manage customer selections, form data, and backend submissions.

## Key Features

-   ✅ **Simplified State Management**: Single source of truth for all service page data
-   ✅ **Type Safety**: Full TypeScript support with well-defined interfaces
-   ✅ **Data Formatting**: Automatic formatting for backend API submissions
-   ✅ **Validation**: Built-in form validation with error reporting
-   ✅ **Optimized Performance**: Uses `useCallback` to prevent unnecessary re-renders
-   ✅ **Easy Maintenance**: Clean, readable code structure
-   ✅ **Extensible**: Easy to add new service types or features

## Installation & Usage

```typescript
import useServicePage from "@/hook/useServicePage";

const MyServiceComponent = () => {
	const {
		// State
		selectedPlan,
		keyboardServices,
		switchServices,
		totalPrice,

		// Actions
		selectPlan,
		addKeyboardService,
		updateKeyboardService,
		submitServiceBooking,
	} = useServicePage();

	// Your component logic here
};
```

## State Structure

### Main State Properties

```typescript
interface IServicePageState {
	selectedPlan: IServicePlan | null; // Selected service plan
	keyboardServices: IKeyboardService[]; // Array of keyboard services
	switchServices: ISwitchService[]; // Array of switch services
	stabilizerServices: IStabilizerService[]; // Array of stabilizer services
	activeTab: number; // Currently active tab index
	shippingInfo: IShippingInfo; // Shipping and delivery info
	contactInfo: IContactInfo; // Customer contact info
	options: {
		// Available options for dropdowns
		switchTypes: IServiceOption[];
		switchStatuses: IServiceOption[];
		keyboardTypes: IServiceOption[];
		pcbTypes: IServiceOption[];
		layouts: IServiceOption[];
	};
}
```

### Service Item Interfaces

#### IKeyboardService

```typescript
interface IKeyboardService {
	id: string; // Unique identifier
	keyboardName: string; // Name of the keyboard
	pcbType: string; // PCB type (hotswap, solder, etc.)
	keyboardSize: string; // Size (60%, 65%, TKL, etc.)
	services: {
		// Available services
		solder: { isSelected: boolean; price: number };
		desolder: { isSelected: boolean; price: number };
		clean: { isSelected: boolean; price: number };
	};
	attachments: Array<{ publicUrl: string; size: number }>;
	note: string; // Customer notes
}
```

#### ISwitchService

```typescript
interface ISwitchService {
	id: string; // Unique identifier
	type: string; // Switch type (linear, tactile, clicky)
	name: string; // Switch name/brand
	quantity: number; // Number of switches
	status: EnumSwitchStatus | null; // New or used
	services: {
		// Available services
		lube: { isSelected: boolean; price: number };
		film: { isSelected: boolean; price: number };
		changeSpring: { isSelected: boolean; price: number };
		clean: { isSelected: boolean; price: number };
	};
	attachments: Array<{ publicUrl: string; size: number }>;
	note: string; // Customer notes
}
```

## Available Actions

### Service Plan Management

```typescript
// Select a service plan
selectPlan(plan: IServicePlan): void

// Example usage
const handlePlanSelect = (plan) => {
  selectPlan(plan);
};
```

### Keyboard Service Management

```typescript
// Add a new keyboard service
addKeyboardService(): void

// Update an existing keyboard service
updateKeyboardService(id: string, updates: Partial<IKeyboardService>): void

// Remove a keyboard service
removeKeyboardService(id: string): void

// Example usage
const handleUpdateKeyboard = (id: string, field: string, value: any) => {
  updateKeyboardService(id, { [field]: value });
};
```

### Switch Service Management

```typescript
// Add a new switch service
addSwitchService(): void

// Update an existing switch service
updateSwitchService(id: string, updates: Partial<ISwitchService>): void

// Remove a switch service
removeSwitchService(id: string): void

// Example usage for nested service updates
const handleUpdateSwitchService = (id: string, serviceName: string, field: string, value: any) => {
  const currentSwitch = switchServices.find(sw => sw.id === id);
  if (currentSwitch) {
    updateSwitchService(id, {
      services: {
        ...currentSwitch.services,
        [serviceName]: {
          ...currentSwitch.services[serviceName],
          [field]: value,
        },
      },
    });
  }
};
```

### Form Management

```typescript
// Update contact information
updateContactInfo(updates: Partial<IContactInfo>): void

// Update shipping information
updateShippingInfo(updates: Partial<IShippingInfo>): void

// Example usage
updateContactInfo({ name: 'John Doe', email: 'john@example.com' });
updateShippingInfo({
  pickup: {
    ...shippingInfo.pickup,
    address: 'New address'
  }
});
```

### Utility Functions

```typescript
// Validate the entire form
validateForm(): string[]

// Submit the service booking
submitServiceBooking(): Promise<any>

// Reset the form to initial state
resetForm(): void

// Format data for backend submission
formatDataForBackend(): IBackendBookingData

// Example validation usage
const handleSubmit = () => {
  const errors = validateForm();
  if (errors.length > 0) {
    alert('Please fix the following errors:\n' + errors.join('\n'));
    return;
  }

  submitServiceBooking()
    .then(() => alert('Success!'))
    .catch(() => alert('Error occurred'));
};
```

## Real-World Examples

### 1. Basic Service Plan Selection

```typescript
const ServicePlanSelector = () => {
  const { selectedPlan, selectPlan } = useServicePage();

  const plans = [
    { value: 1, name: 'Basic', price: 200000, dateTime: '3-5 days' },
    { value: 2, name: 'Premium', price: 500000, dateTime: '5-7 days' },
  ];

  return (
    <div>
      {plans.map(plan => (
        <div
          key={plan.value}
          className={selectedPlan?.value === plan.value ? 'selected' : ''}
          onClick={() => selectPlan(plan)}
        >
          <h3>{plan.name}</h3>
          <p>{plan.price.toLocaleString()}đ</p>
          <p>{plan.dateTime}</p>
        </div>
      ))}
    </div>
  );
};
```

### 2. Dynamic Keyboard Service Form

```typescript
const KeyboardServiceForm = () => {
  const {
    keyboardServices,
    addKeyboardService,
    updateKeyboardService,
    removeKeyboardService,
  } = useServicePage();

  return (
    <div>
      <button onClick={addKeyboardService}>Add Keyboard</button>

      {keyboardServices.map(keyboard => (
        <div key={keyboard.id}>
          <input
            value={keyboard.keyboardName}
            onChange={(e) => updateKeyboardService(keyboard.id, {
              keyboardName: e.target.value
            })}
            placeholder="Keyboard name"
          />

          <select
            value={keyboard.pcbType}
            onChange={(e) => updateKeyboardService(keyboard.id, {
              pcbType: e.target.value
            })}
          >
            <option value="">Select PCB Type</option>
            <option value="hotswap">Hotswap</option>
            <option value="solder">Solder</option>
          </select>

          {/* Service checkboxes */}
          {Object.entries(keyboard.services).map(([serviceName, service]) => (
            <label key={serviceName}>
              <input
                type="checkbox"
                checked={service.isSelected}
                onChange={(e) => {
                  updateKeyboardService(keyboard.id, {
                    services: {
                      ...keyboard.services,
                      [serviceName]: {
                        ...service,
                        isSelected: e.target.checked,
                      },
                    },
                  });
                }}
              />
              {serviceName}
              {service.isSelected && (
                <input
                  type="number"
                  value={service.price}
                  onChange={(e) => {
                    updateKeyboardService(keyboard.id, {
                      services: {
                        ...keyboard.services,
                        [serviceName]: {
                          ...service,
                          price: Number(e.target.value),
                        },
                      },
                    });
                  }}
                  placeholder="Price"
                />
              )}
            </label>
          ))}

          <button onClick={() => removeKeyboardService(keyboard.id)}>
            Remove
          </button>
        </div>
      ))}
    </div>
  );
};
```

### 3. Complete Form with Validation and Submission

```typescript
const CompleteServiceForm = () => {
  const {
    selectedPlan,
    keyboardServices,
    switchServices,
    contactInfo,
    totalPrice,
    updateContactInfo,
    validateForm,
    submitServiceBooking,
    resetForm,
  } = useServicePage();

  const handleSubmit = async () => {
    const errors = validateForm();
    if (errors.length > 0) {
      alert('Please fix the following errors:\n' + errors.join('\n'));
      return;
    }

    try {
      await submitServiceBooking();
      alert('Service booked successfully!');
      resetForm();
    } catch (error) {
      alert('Failed to book service. Please try again.');
    }
  };

  return (
    <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
      {/* Service selection components */}

      {/* Contact information */}
      <div>
        <input
          type="text"
          value={contactInfo.name}
          onChange={(e) => updateContactInfo({ name: e.target.value })}
          placeholder="Full name"
          required
        />
        <input
          type="email"
          value={contactInfo.email}
          onChange={(e) => updateContactInfo({ email: e.target.value })}
          placeholder="Email"
          required
        />
        <input
          type="tel"
          value={contactInfo.phone}
          onChange={(e) => updateContactInfo({ phone: e.target.value })}
          placeholder="Phone"
          required
        />
      </div>

      {/* Summary */}
      <div>
        <h3>Total: {totalPrice.toLocaleString()}đ</h3>
        <button type="submit">Book Service</button>
        <button type="button" onClick={resetForm}>Reset</button>
      </div>
    </form>
  );
};
```

## Data Flow

### 1. Customer Interaction → State Update

```
User selects plan → selectPlan() → selectedPlan state updated
User adds service → addKeyboardService() → new item added to keyboardServices array
User updates service → updateKeyboardService() → specific item in array updated
```

### 2. State → Calculated Values

```
All services + plan → calculateTotalPrice() → totalPrice computed
Form fields → validateForm() → validation errors array
```

### 3. Submission → Backend

```
Current state → formatDataForBackend() → Backend-compatible format
Formatted data → ServiceClient.upsertBooking() → API call
```

## Migration Guide

### From useServices + useSelectedOption

**Before:**

```typescript
// Multiple hooks and complex state management
const { selectedOpt, serviceForm, keyboardItems } = useServices();
const { updateSelectedOpt, addKeyboardItem } = useServiceAction();
const { serviceSwitchSelected, handleChangeOption } = useSelectedOption(props);
```

**After:**

```typescript
// Single hook with unified state
const {
	selectedPlan,
	keyboardServices,
	switchServices,
	selectPlan,
	addKeyboardService,
	updateKeyboardService,
} = useServicePage();
```

## Benefits of the New Hook

1. **Simplified State Management**: One hook instead of two, reducing complexity
2. **Better Type Safety**: Comprehensive TypeScript interfaces
3. **Improved Performance**: Optimized with useCallback and proper memoization
4. **Easier Testing**: Single hook to test instead of multiple interconnected ones
5. **Better Maintainability**: Clear separation of concerns and consistent patterns
6. **Enhanced Developer Experience**: Intuitive API with comprehensive documentation

## Best Practices

1. **Use the hook at the top level** of your service page component
2. **Destructure only what you need** to avoid unnecessary re-renders
3. **Use the validation function** before submitting
4. **Handle errors gracefully** in async operations
5. **Keep the UI in sync** with the hook's state
6. **Use TypeScript** to get full type safety benefits

## Troubleshooting

### Common Issues

1. **State not updating**: Make sure you're using the provided action functions, not mutating state directly
2. **Performance issues**: Only destructure the state/actions you actually use in each component
3. **Validation errors**: Check that all required fields are filled before submission
4. **API errors**: Ensure the backend expects the formatted data structure

### Debug Tips

```typescript
// Log the current state
console.log("Current state:", {
	selectedPlan,
	keyboardServices,
	switchServices,
	totalPrice,
});

// Log formatted data before submission
const formattedData = formatDataForBackend();
console.log("Formatted for backend:", formattedData);

// Check validation errors
const errors = validateForm();
console.log("Validation errors:", errors);
```
