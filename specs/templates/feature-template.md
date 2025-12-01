# Feature Template

## Overview

Brief description of the feature and its purpose.

## Behavior Specification (Gherkin)

```gherkin
Feature: [Feature Name]
  As a [user type]
  I want to [goal]
  So that [benefit]

  Background:
    Given [initial context]

  Scenario: [Scenario name]
    Given [context]
    When [action]
    Then [expected outcome]

  Scenario: [Another scenario]
    Given [different context]
    When [different action]
    Then [different outcome]
```

## API Specification (OpenAPI)

```yaml
# Add to specs/api/openapi.yml
paths:
    /api/[endpoint]:
        [method]:
            summary: [Brief description]
            parameters:
                - name: [paramName]
                  in: [path|query]
                  schema:
                      type: [string|number|boolean]
            responses:
                "200":
                    description: Success
                    content:
                        application/json:
                            schema:
                                $ref: "../data/[schema].schema.json"
```

## Data Specification (JSON Schema)

```json
{
	"$schema": "http://json-schema.org/draft-07/schema#",
	"title": "[DataModel]",
	"type": "object",
	"properties": {
		"id": { "type": "string" },
		"name": { "type": "string" }
	},
	"required": ["id", "name"]
}
```

## Implementation Checklist

- [ ] Behavior specification written
- [ ] API specification defined
- [ ] Data schema created
- [ ] Component structure planned
- [ ] API client methods added
- [ ] React Query hooks created
- [ ] State management updated
- [ ] UI components implemented
- [ ] Validation completed
- [ ] Tests written

## Files to Create/Update

- `specs/behavior/[feature].feature`
- `specs/data/[model].schema.json`
- `specs/api/openapi.yml` (update)
- `src/components/[Feature]/`
- `src/client/[Client].ts`
- `src/react-query/[hooks].ts`
- `src/zustand/[store].ts` (if needed)

## Testing

- Unit tests for components
- Integration tests for API calls
- E2E tests for user journeys
- Contract tests against specifications
