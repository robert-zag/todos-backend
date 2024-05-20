import { z } from "zod"
import { OpenAPIRegistry, OpenApiGeneratorV31, extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi"

import * as getList from "../api/todo-list/get.list"
import * as postList from "../api/todo-list/post.list"
import * as postLogin from "../api/auth/post.login"
import * as postRegister from "../api/auth/post.register"
import * as postListShare from "../api/todo-list/post.listShare"
import * as postItem from "../api/todo-list/post.item"
import * as patchItemStatus from "../api/todo-item/patch.itemStatus"

extendZodWithOpenApi(z)

const registry = new OpenAPIRegistry()

registry.registerPath({
	method: "post",
	path: "/api/auth/register",
	summary: "Register a new user",
	request: {
		body: {
			description: "Registration data",
			content: {
				"application/json": {
					schema: postRegister.requestSchema.shape.body
				}
			}
		}
	},
	responses: {
		201: {
			description: "Registration successful",
			content: {
				"application/json": {
					schema: postRegister.responseSchema
				}
			}
		}
	}
})

registry.registerPath({
	method: "post",
	path: "/api/auth/login",
	summary: "Login to the system",
	request: {
		body: {
			description: "Login data",
			content: {
				"application/json": {
					schema: postLogin.requestSchema.shape.body
				}
			}
		}
	},
	responses: {
		200: {
			description: "Login successful",
			content: {
				"application/json": {
					schema: postLogin.responseSchema
				}
			}
		}
	}
})

registry.registerPath({
	method: "post",
	path: "/api/todo-list",
	summary: "Create a new todo list",
	security: [
		{
			BearerAuth: []
		}
	],
	request: {
		body: {
			description: "Todo list creation data",
			content: {
				"application/json": {
					schema: postList.requestSchema.shape.body
				}
			}
		}
	},
	responses: {
		200: {
			description: "Todo list created",
			content: {
				"application/json": {
					schema: postList.responseSchema
				}
			}
		}
	}
})

registry.registerPath({
	method: "get",
	path: "/api/todo-list/{todoListId}",
	summary: "Get info about one todo list",
	request: {
		params: getList.requestSchema.shape.params
	},
	responses: {
		200: {
			description: "Info about single todo list",
			content: {
				"application/json": {
					schema: getList.responseSchema
				}
			}
		}
	}
})

registry.registerPath({
	method: "post",
	path: "/api/todo-list/{todoListId}/share",
	summary: "Share ownership of todo list with another user",
	security: [
		{
			BearerAuth: []
		}
	],
	request: {
		params: postListShare.requestSchema.shape.params,
		body: {
			description: "Todo list sharing data",
			content: {
				"application/json": {
					schema: postListShare.requestSchema.shape.body
				}
			}
		}
	},
	responses: {
		200: {
			description: "Todo shared successfully",
			content: {
				"application/json": {
					schema: postListShare.responseSchema
				}
			}
		}
	}
})

registry.registerPath({
	method: "post",
	path: "/api/todo-list/{todoListId}/item",
	summary: "Add a new item to the todo list",
	security: [
		{
			BearerAuth: []
		}
	],
	request: {
		params: postItem.requestSchema.shape.params,
		body: {
			description: "Todo list item data",
			content: {
				"application/json": {
					schema: postItem.requestSchema.shape.body
				}
			}
		}
	},
	responses: {
		200: {
			description: "Todo item added to list successfully",
			content: {
				"application/json": {
					schema: postItem.responseSchema
				}
			}
		}
	}
})

registry.registerPath({
	method: "patch",
	path: "/api/todo-item/{todoItemId}/status",
	summary: "Edit the status of a todo item",
	security: [
		{
			BearerAuth: []
		}
	],
	request: {
		params: patchItemStatus.requestSchema.shape.params,
		body: {
			description: "New status of the todo item",
			content: {
				"application/json": {
					schema: patchItemStatus.requestSchema.shape.body
				}
			}
		}
	},
	responses: {
		200: {
			description: "Todo item status updated successfully",
			content: {
				"application/json": {
					schema: patchItemStatus.responseSchema
				}
			}
		}
	}
})

const generator = new OpenApiGeneratorV31(registry.definitions)
const openApiDocument = generator.generateDocument({
	openapi: "3.1.0",
	info: {
		version: "1.0.0",
		title: "API",
		description: "Todo list API documentation"
	},
	servers: [{ url: "/" }]
})

openApiDocument.components = {
	securitySchemes: {
		BearerAuth: {
			type: "http",
			scheme: "bearer",
			bearerFormat: "JWT"
		}
	}
}

export default openApiDocument
