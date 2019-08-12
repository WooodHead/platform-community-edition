# Migration `20190804202705-change-ids`

This migration has been generated by Mitko Tschimev at 8/4/2019, 8:27:06 PM.
You can check out the [state of the datamodel](./datamodel.prisma) after the migration.

## Database Steps

```sql
DROP TABLE "public"."User","public"."TestSession","public"."Project","public"."_ProjectToUser","public"."Variation","public"."Test";

CREATE TABLE "public"."User"("id" text NOT NULL  ,"createdAt" timestamp(3) NOT NULL  ,"updatedAt" timestamp(3) NOT NULL DEFAULT '1970-01-01 00:00:00' ,"email" text NOT NULL DEFAULT '' ,"password" text NOT NULL DEFAULT '' ,"lastname" text   ,"forename" text   ,"active" boolean NOT NULL DEFAULT false ,"role" text NOT NULL DEFAULT 'CUSTOMER' ,"apiKey" text NOT NULL DEFAULT '' ,PRIMARY KEY ("id"));

CREATE TABLE "public"."Project"("id" text NOT NULL  ,"createdAt" timestamp(3) NOT NULL  ,"updatedAt" timestamp(3) NOT NULL DEFAULT '1970-01-01 00:00:00' ,"name" text NOT NULL DEFAULT '' ,"description" text   ,PRIMARY KEY ("id"));

CREATE TABLE "public"."Test"("id" text NOT NULL  ,"createdAt" timestamp(3) NOT NULL  ,"updatedAt" timestamp(3) NOT NULL DEFAULT '1970-01-01 00:00:00' ,"name" text NOT NULL DEFAULT '' ,PRIMARY KEY ("id"));

CREATE TABLE "public"."Variation"("id" text NOT NULL  ,"createdAt" timestamp(3) NOT NULL  ,"updatedAt" timestamp(3) NOT NULL DEFAULT '1970-01-01 00:00:00' ,"browserName" text NOT NULL DEFAULT '' ,"deviceName" text NOT NULL DEFAULT '' ,"additionalData" text   ,PRIMARY KEY ("id"));

CREATE TABLE "public"."TestSession"("id" text NOT NULL  ,"createdAt" timestamp(3) NOT NULL  ,"updatedAt" timestamp(3) NOT NULL DEFAULT '1970-01-01 00:00:00' ,"diffImageKey" text   ,"imageKey" text   ,"misMatchPercentage" Decimal(65,30)   ,"misMatchTolerance" Decimal(65,30) NOT NULL DEFAULT 0 ,"isSameDimensions" boolean   ,"state" text NOT NULL DEFAULT 'PENDING' ,"stateComment" text   ,"autoBaseline" boolean NOT NULL DEFAULT false ,PRIMARY KEY ("id"));

CREATE TABLE "public"."_ProjectToUser"("A" text NOT NULL  REFERENCES "public"."Project"("id"),"B" text NOT NULL  REFERENCES "public"."User"("id"));

ALTER TABLE "public"."Test" ADD COLUMN "project" text NOT NULL  REFERENCES "public"."Project"("id");

ALTER TABLE "public"."Variation" ADD COLUMN "test" text NOT NULL  REFERENCES "public"."Test"("id"),ADD COLUMN "baseline" text   REFERENCES "public"."TestSession"("id");

ALTER TABLE "public"."TestSession" ADD COLUMN "stateChangedByUser" text   REFERENCES "public"."User"("id"),ADD COLUMN "variation" text NOT NULL  REFERENCES "public"."Variation"("id"),ADD COLUMN "baselineForDiffRef" text   REFERENCES "public"."TestSession"("id");
```

## Changes

```diff
diff --git datamodel.mdl datamodel.mdl
migration 20190727105933-add-diff-relation..20190804202705-change-ids
--- datamodel.dml
+++ datamodel.dml
@@ -3,14 +3,21 @@
   url      = env("VK_POSTGRES_URL")
 }
 generator photon {
-  provider = "photonjs"
-  output   = "src/lib/@generated/photonjs"
+  provider  = "photonjs"
+  platforms = ["native", "linux-glibc-libssl1.0.2"]
+  output    = "../../node_modules/@generated/photonjs"
 }
+generator photon_layer {
+  provider  = "photonjs"
+  platforms = ["linux-glibc-libssl1.0.2"]
+  output    = "../../layers/photon/nodejs/node_modules/@generated/photonjs"
+}
+
 model User {
-  id        Int      @id
+  id        String   @id @default(cuid())
   createdAt DateTime @default(now())
   updatedAt DateTime @updatedAt
   email    String    @unique
@@ -23,9 +30,9 @@
   apiKey   String    @unique
 }
 model Project {
-  id        Int      @id
+  id        String   @id @default(cuid())
   createdAt DateTime @default(now())
   updatedAt DateTime @updatedAt
   name        String
@@ -34,9 +41,9 @@
   users       User[]
 }
 model Test {
-  id        Int      @id
+  id        String   @id @default(cuid())
   createdAt DateTime @default(now())
   updatedAt DateTime @updatedAt
   name       String
@@ -44,9 +51,9 @@
   variations Variation[]
 }
 model Variation {
-  id        Int      @id
+  id        String   @id @default(cuid())
   createdAt DateTime @default(now())
   updatedAt DateTime @updatedAt
   browserName String
@@ -58,9 +65,9 @@
   baseline       TestSession?  @relation(name: "VariationBaseline")
 }
 model TestSession {
-  id        Int      @id
+  id        String   @id @default(cuid())
   createdAt DateTime @default(now())
   updatedAt DateTime @updatedAt
   diffImageKey       String?
```

## Photon Usage

You can use a specific Photon built for this migration (20190804202705-change-ids)
in your `before` or `after` migration script like this:

```ts
import Photon from '@generated/photon/20190804202705-change-ids'

const photon = new Photon()

async function main() {
  const result = await photon.users()
  console.dir(result, { depth: null })
}

main()

```