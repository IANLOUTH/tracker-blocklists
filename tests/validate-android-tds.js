const Ajv = require("ajv")
const fs = require("fs")
const ajv = new Ajv({ allErrors: true })

const schema = {
    type: "object",
    properties: {
        readme: {type: "string"},
        version: {type: "integer"},
        trackers: {
            type: "object",
            patternProperties: {
                "^.+\..+$": {type: "object",
                    properties: {
                        owner: {type: "object",
                            properties: {
                                name: { type: "string" },
                                displayName: { type: "string" },
                            },
                            required: ["name", "displayName"],
                            additionalProperties: false,
                        },
                        default: { type: "string" },
                    },
                    required: ["owner", "default"],
                    additionalProperties: false,
                },
                
            },
        },
        packageNames: {
            type: "object",
            patternProperties: {
                "^.+\..+$": {type: "string"},
            },
        },
        entities: {
            type: "object",
            patternProperties: {
                "^.{2,}$": {
                    type: "object",
                    properties: {
                        score: { type: "integer" },
                        signals: { type: "array" },
                    },
                    required: ["score", "signals"],
                    additionalProperties: false,
                },
            },
        },
    },
    required: ["readme", "version", "trackers", "packageNames", "entities"],
    additionalProperties: false,
}

const validate = ajv.compile(schema)

const list = JSON.parse(fs.readFileSync("app/android-tds.json"))

test(list)

function test(data) {
    const valid = validate(data)
    if (valid) {
        console.log("Valid!")
    } else {
        console.log("Invalid: " + ajv.errorsText(validate.errors))
    }
}