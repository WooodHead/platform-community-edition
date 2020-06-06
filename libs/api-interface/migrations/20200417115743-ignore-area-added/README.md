# Migration `20200417115743-ignore-area-added`

This migration has been generated by Filtering is added at 4/17/2020, 11:57:43 AM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
CREATE TABLE "public"."IgnoreArea" (
    "createdAt" timestamp(3)  NOT NULL DEFAULT '1970-01-01 00:00:00',
    "height" integer  NOT NULL DEFAULT 0,
    "id" text  NOT NULL ,
    "updatedAt" timestamp(3)  NOT NULL DEFAULT '1970-01-01 00:00:00',
    "variation" text   ,
    "width" integer  NOT NULL DEFAULT 0,
    "x" integer  NOT NULL DEFAULT 0,
    "y" integer  NOT NULL DEFAULT 0,
    PRIMARY KEY ("id")
) 

ALTER TABLE "public"."IgnoreArea" ADD FOREIGN KEY ("variation")REFERENCES "public"."Variation"("id") ON DELETE SET NULL  ON UPDATE CASCADE
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20200407161441-init..20200417115743-ignore-area-added
--- datamodel.dml
+++ datamodel.dml
@@ -2,9 +2,9 @@
 datasource db {
   // https://github.com/prisma/prisma2/blob/master/docs/core/connectors
   // mysql | sqlite | postgresql
   provider = "postgresql"
-  url = "***"
+  url      = env("VK_DATABASE")
 }
 generator photon {
   provider     = "prisma-client-js"
@@ -49,8 +49,10 @@
   updatedAt DateTime @updatedAt
   browserName String
   deviceName  String
   test        Test
+
+  ignoreAreas    IgnoreArea[]
   testSessions   TestSession[]
   additionalData String?
   baseline       TestSession?  @relation(name: "VariationBaseline")
 }
@@ -72,8 +74,19 @@
   // baseline reference
   baselineRef Variation? @relation(name: "VariationBaseline")
 }
+model IgnoreArea {
+  id        String   @id @default(cuid())
+  createdAt DateTime @default(now())
+  updatedAt DateTime @updatedAt
+
+  x Int
+  y Int
+  width Int
+  height Int
+}
+
 enum Role {
   CUSTOMER
   ADMIN
 }
```

