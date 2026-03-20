CREATE TABLE "files" (
	"id" serial PRIMARY KEY NOT NULL,
	"file_id" text NOT NULL,
	"room_id" text NOT NULL,
	"uploader_id" text NOT NULL,
	"file_name" text NOT NULL,
	"file_size" integer NOT NULL,
	"file_type" text NOT NULL,
	"file_url" text NOT NULL,
	"public_id" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "files_file_id_unique" UNIQUE("file_id")
);
--> statement-breakpoint
CREATE TABLE "rooms" (
	"id" serial PRIMARY KEY NOT NULL,
	"room_id" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "rooms_room_id_unique" UNIQUE("room_id")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
