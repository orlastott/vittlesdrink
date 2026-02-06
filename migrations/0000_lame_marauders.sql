CREATE TABLE "drinks" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"type" text NOT NULL,
	"flavour_notes" text NOT NULL,
	"region" text NOT NULL,
	"abv" text NOT NULL,
	"recommended_foods" text NOT NULL,
	"affiliate_link" text NOT NULL,
	"description" text NOT NULL,
	"image_url" text,
	"awards" text,
	"review_link" text,
	"price_tier" text
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"password" text NOT NULL,
	CONSTRAINT "users_username_unique" UNIQUE("username")
);
