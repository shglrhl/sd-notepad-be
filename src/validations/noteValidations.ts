import { body, oneOf, param } from "express-validator";

export const newNoteValidation = [
	/*  #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: {
                        $ref: "#/components/schemas/newNote"
                    }  
                }
            }
        } 
    */
	body("title")
		.exists()
		.withMessage("Missing note title"),
	body("content").exists().withMessage("Content is missing").isString(),
	body("tags").optional().isArray().withMessage("Invalid type for tags"),
	oneOf([
		// * Option 1: 'sharedWith' is not provided
		body("sharedWith")
			.not()
			.exists(),
		// * Option 2: 'sharedWith' is an array of positive integers
		[
			body("sharedWith").isArray().withMessage("Invalid type for sharedWith"),
			body("sharedWith.*")
				.isInt({ min: 0 })
				.withMessage("Invalid type for sharedWith userId"),
		],
	]),
];

export const updateNoteValidation = [
	/*  #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: {
                        $ref: "#/components/schemas/updateNote"
                    }  
                }
            }
        } 
    */
	param("id")
		.isInt()
		.withMessage("Note ID must be a valid integer"),
	body("title").exists().withMessage("Missing note title"),
	body("content").exists().withMessage("Content is missing").isString(),
	body("tags").optional().isArray().withMessage("Invalid type for tags"),
];

export const sharedNoteValidation = [
	/* #swagger.parameters['id'] = {  
		in: 'path',              
        description: 'ID of the note to share',                   
        required: true, 
		schema: {
			$ref: "#/components/schemas/noteId"
        }  
	}
	*/
	/*  #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: {
                        $ref: "#/components/schemas/shareNote"
                    }  
                }
            }
        } 
    */
	param("id")
		.isInt()
		.withMessage("Note ID must be a valid integer"),
	body("sharedWith").isEmail().withMessage("Invalid email id"),
];

export const noteIdValidation = [
	/* #swagger.parameters['id'] = {   
		in: 'path',                                        
        description: 'Note ID',                   
        required: true,                     
        schema: {
			$ref: "#/components/schemas/noteId"
        }  
	}
	*/
	param("id")
		.isInt()
		.withMessage("Note ID must be a valid integer"),
];

export const searchNotesValidation = [
	/* #swagger.parameters['query'] = {   
		in: 'query',                                        
		description: 'Search query',                   
		required: true,                     
		schema: {
			"type": "string"
		}  
	}
	*/
	body("query")
		.exists()
		.withMessage("Missing search query")
		.isString()
		.withMessage("Invalid search query string"),
];
