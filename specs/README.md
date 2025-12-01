# Specification-Driven Design (SDD) for NoobStore Web UI

## Overview

This project uses **Specification-Driven Design (SDD)** methodology to ensure high-quality, unambiguous development. SDD creates formal, machine-readable specifications that become the **Single Source of Truth** for all development and QA activities.

## SDD Components

### 1. API Specifications (OpenAPI)

- **Location**: `specs/api/`
- **Format**: OpenAPI 3.0 YAML files
- **Purpose**: Define all API endpoints, parameters, request/response schemas, and status codes
- **Tool**: Swagger/OpenAPI specification

### 2. Data Specifications (JSON Schema)

- **Location**: `specs/data/`
- **Format**: JSON Schema files
- **Purpose**: Define exact structure, types, and validation rules for all data models
- **Tool**: JSON Schema validation

### 3. Behavior Specifications (Gherkin)

- **Location**: `specs/behavior/`
- **Format**: `.feature` files with Gherkin syntax
- **Purpose**: Describe expected behavior in business-readable format
- **Tool**: Cucumber/Gherkin syntax

## Directory Structure

```
specs/
├── api/
│   ├── openapi.yml                    # Complete OpenAPI specification
│   └── endpoints/                     # Individual endpoint specs
│       ├── users.yml
│       ├── services.yml
│       └── products.yml
├── data/
│   ├── user.schema.json              # User data model
│   ├── service.schema.json           # Service data model
│   ├── product.schema.json           # Product data model
│   └── common/                       # Shared schemas
│       ├── address.schema.json
│       └── payment.schema.json
└── behavior/
    ├── user-management.feature       # User-related features
    ├── service-booking.feature       # Service booking features
    ├── payment-processing.feature    # Payment features
    └── product-management.feature    # Product features
```

## Development Workflow

### 1. Feature Planning Phase

```gherkin
# specs/behavior/service-booking.feature
Feature: Service Booking System
  As a customer
  I want to book keyboard services
  So that I can get professional maintenance

  Scenario: Successfully book a keyboard service
    Given I am an authenticated user
    And I have selected a keyboard service
    When I submit the booking form
    Then the service should be booked successfully
    And I should receive a confirmation email
```

### 2. API Design Phase

```yaml
# specs/api/openapi.yml
paths:
    /api/services:
        post:
            summary: Create a new service booking
            security:
                - bearerAuth: []
            requestBody:
                required: true
                content:
                    application/json:
                        schema:
                            $ref: "../data/service-booking-request.schema.json"
            responses:
                "201":
                    description: Service booked successfully
                    content:
                        application/json:
                            schema:
                                $ref: "../data/service.schema.json"
```

### 3. Data Modeling Phase

```json
// specs/data/service.schema.json
{
	"$schema": "http://json-schema.org/draft-07/schema#",
	"title": "Service",
	"type": "object",
	"properties": {
		"id": { "type": "string" },
		"name": { "type": "string" },
		"description": { "type": "string" },
		"status": {
			"type": "string",
			"enum": ["CREATED", "IN_PROGRESS", "COMPLETED", "CANCELLED"]
		},
		"totalAmount": { "type": "number", "minimum": 0 },
		"customer": { "$ref": "user.schema.json" },
		"items": {
			"type": "array",
			"items": { "$ref": "service-item.schema.json" }
		}
	},
	"required": ["id", "name", "status", "totalAmount", "customer"]
}
```

### 4. Implementation Phase

- **Frontend**: Implement UI components that consume the API specs
- **Backend**: Implement endpoints that match the OpenAPI specs
- **Validation**: Ensure data conforms to JSON schemas

### 5. Testing Phase

- **Contract Testing**: Validate API responses against OpenAPI specs
- **Schema Validation**: Ensure data structures match JSON schemas
- **Behavior Testing**: Run Gherkin scenarios as integration tests

## How to Create Specifications

### Creating a New Feature

1. **Start with Behavior** (Product Owner/PM)
    - Write Gherkin scenarios in `.feature` files
    - Define user journeys and acceptance criteria

2. **Design API** (Technical Lead/Architect)
    - Create OpenAPI specifications
    - Define endpoints, parameters, and responses

3. **Model Data** (Backend Developer)
    - Create JSON schemas for data structures
    - Define validation rules and constraints

4. **Implement** (Development Team)
    - Code must satisfy all specifications
    - No deviations from defined contracts

### Example: Adding User Profile Feature

#### 1. Behavior Specification

```gherkin
# specs/behavior/user-profile.feature
Feature: User Profile Management
  As a registered user
  I want to view and update my profile
  So that I can manage my account information

  Scenario: View user profile
    Given I am logged in as "user123"
    When I request my profile information
    Then I should receive my complete profile data
    And the response should include my name, email, and preferences

  Scenario: Update user profile
    Given I am logged in as "user123"
    When I update my profile with new information
    Then my profile should be updated successfully
    And I should receive confirmation of the changes
```

#### 2. API Specification

```yaml
# specs/api/openapi.yml (excerpt)
paths:
    /api/users/{userId}:
        get:
            summary: Get user profile
            parameters:
                - name: userId
                  in: path
                  required: true
                  schema:
                      type: string
            responses:
                "200":
                    description: User profile retrieved successfully
                    content:
                        application/json:
                            schema:
                                $ref: "../data/user.schema.json"
        put:
            summary: Update user profile
            parameters:
                - name: userId
                  in: path
                  required: true
                  schema:
                      type: string
            requestBody:
                content:
                    application/json:
                        schema:
                            $ref: "../data/user-update.schema.json"
            responses:
                "200":
                    description: Profile updated successfully
```

#### 3. Data Specification

```json
// specs/data/user.schema.json
{
	"$schema": "http://json-schema.org/draft-07/schema#",
	"title": "User",
	"type": "object",
	"properties": {
		"id": { "type": "string" },
		"name": { "type": "string", "minLength": 1 },
		"email": { "type": "string", "format": "email" },
		"phone": { "type": "string", "pattern": "^[0-9+()-\\s]+$" },
		"preferences": {
			"type": "object",
			"properties": {
				"language": { "type": "string", "enum": ["vi", "en"] },
				"notifications": { "type": "boolean" }
			}
		}
	},
	"required": ["id", "name", "email"]
}
```

## Tools and Validation

### API Validation

```bash
# Validate OpenAPI specification
npx @apidevtools/swagger-parser specs/api/openapi.yml

# Generate API documentation
npx @redocly/cli build-docs specs/api/openapi.yml -o docs/api.html
```

### Data Validation

```bash
# Validate JSON against schema
npx ajv validate -s specs/data/user.schema.json -d user-data.json

# Test with sample data
npx json-schema-faker specs/data/user.schema.json
```

### Behavior Testing

```bash
# Run Gherkin scenarios
npx cucumber-js specs/behavior/ --require step-definitions/
```

## Benefits of SDD

1. **Eliminates Ambiguity**: Clear, formal contracts prevent misunderstandings
2. **Automated Validation**: Contract testing ensures compliance
3. **Living Documentation**: Specifications serve as accurate documentation
4. **Quality Assurance**: Schema validation prevents data inconsistencies
5. **Team Alignment**: Common language between business and technical teams

## Getting Started

1. **Read existing specifications** in the `specs/` directory
2. **Follow the workflow** for new features
3. **Validate implementations** against specifications
4. **Update specifications** when requirements change

## Need Help?

- Check existing specifications for patterns
- Review the examples in this README
- Ask team members for clarification on specific specs
- Use validation tools to test your implementations

Remember: **Specifications are the Single Source of Truth** - always implement to satisfy the specs, never deviate from them!</content>
<parameter name="filePath">/Users/harry.tran/Documents/source/noobstore-web-ui/specs/README.md
