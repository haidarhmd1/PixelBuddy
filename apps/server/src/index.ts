import { createContext } from "@PixelBuddy/api/context";
import { appRouter } from "@PixelBuddy/api/routers/index";
import { env } from "@PixelBuddy/env/server";
import fastifyCors from "@fastify/cors";
import { OpenAPIHandler } from "@orpc/openapi/fastify";
import { OpenAPIReferencePlugin } from "@orpc/openapi/plugins";
import { onError } from "@orpc/server";
import { RPCHandler } from "@orpc/server/fastify";
import { ZodToJsonSchemaConverter } from "@orpc/zod/zod4";
import Fastify from "fastify";

const baseCorsConfig = {
	allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
	credentials: true,
	maxAge: 86_400,
	methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
	origin: env.CORS_ORIGIN,
};

const rpcHandler = new RPCHandler(appRouter, {
	interceptors: [
		onError((error) => {
			console.error(error);
		}),
	],
});

const apiHandler = new OpenAPIHandler(appRouter, {
	interceptors: [
		onError((error) => {
			console.error(error);
		}),
	],
	plugins: [
		new OpenAPIReferencePlugin({
			schemaConverters: [new ZodToJsonSchemaConverter()],
		}),
	],
});

const fastify = Fastify({
	logger: true,
});

fastify.register(fastifyCors, baseCorsConfig);

fastify.register(async (rpcApp) => {
	// Fully utilize oRPC features by letting oRPC parse the request body.
	rpcApp.addContentTypeParser("*", (_, _payload, done) => {
		done(null, undefined);
	});

	rpcApp.all("/rpc/*", async (request, reply) => {
		const { matched } = await rpcHandler.handle(request, reply, {
			context: await createContext(request.headers),
			prefix: "/rpc",
		});

		if (!matched) {
			reply.status(404).send();
		}
	});

	rpcApp.all("/api-reference/*", async (request, reply) => {
		const { matched } = await apiHandler.handle(request, reply, {
			context: await createContext(request.headers),
			prefix: "/api-reference",
		});

		if (!matched) {
			reply.status(404).send();
		}
	});
});

fastify.get("/", async () => "OK");

fastify.listen({ host: "0.0.0.0", port: 3000 }, (err) => {
	if (err) {
		fastify.log.error(err);
		process.exit(1);
	}
	console.log("Server running on port 3000");
});
