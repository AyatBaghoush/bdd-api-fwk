const Joi = require('joi');
const getLogger = require('../helpers/logger');
const logger = getLogger('SchemaValidator');

class Validator {
  constructor() {
    this.schemas = {};
  }

  /**
   * Register a named schema
   */
  registerSchema(name, schema) {
    logger.info(`Registering schema: ${name}`);
    this.schemas[name] = schema;
  }

  /**
   * Validate data against a named schema
   */
  validate(name, data) {
    const schema = this.schemas[name];
    if (!schema) {
      logger.error(`Schema "${name}" not found`);
    }

    const { error, value } = schema.validate(data, { abortEarly: false });
    if (error) {
      logger.error(`Validation failed for "${name}":\n${error.details.map(d => d.message).join('\n')}`);
    }
    logger.info(`Validation finished for schema: ${name}`);
    return value;
  }

  /**
   * Validate data against an inline schema
   */
  validateInline(schema, data) {
    const { error, value } = schema.validate(data, { abortEarly: false });
    if (error) {
      logger.error(`Inline validation failed:\n${error.details.map(d => d.message).join('\n')}`);
    }

    return value;
  }
}

module.exports = new Validator();
