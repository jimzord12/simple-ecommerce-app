# How to setup a PostgreSQL DB using pgAdmin4

### 1. Download pgAdmin4

- [Official Page](https://www.pgadmin.org/download/)

### 2. Creating a new DB

1. Go to the top menu
2. Click on "Object" (is located next to "File")
3. Click on "Create", then "Database"

A Window called "Create - Database" should open.

4. Enter a name for your database at the field "Database". For example, 'e_shop'
5. A new Database named "e_shop" should now exists. To verify its creation, expand the "Object Browser" (located at the left) in following manner:

   Servers -> PostgreSQL -> Databases -> e_shop

![Selecting New Database](/backend/e-commerce-app/internal/database/sql/img_for_readme/pgAdmin_001.png)

### 3. Adding the DB Schema

Now, we need to create the DB's tables and their fields. This can be done either using the pgAdmin's GUI or by executing SQL scripts.

To make the process fast and simple we will use **_SQL scripts_**.

1. Select the newly created DB (when selected it's background color changes to light blue, as indicated in the previous image)

2. Go to the top menu, can click on "Tools" (#1 in img below)

3. Then click on Query Tool (#2 in img below)

![Finding Query Tool](/backend/e-commerce-app/internal/database/sql/img_for_readme/pgAdmin_002.png)

Now we are able to execute SQL scripts.

4. Next, we simply need to copy the contents of the SQL script named "db_schema.sql" into the "Query" tab (see img below #1)

5. Finally, click on "play buttom" to execute the SQL script (see img below #2).

![Creating the Schema](/backend/e-commerce-app/internal/database/sql/img_for_readme/pgAdmin_003.png)

6. After the execution, a success toast message should briefly appear at the bottom right corner of the pgAdmin window.

7. To verify that the tables were successfully created.

   Go to "Object Explorer" and expand the following:

   Servers -> PostgreSQL -> Databases -> e_shop -> Schemas -> public -> tables

There should be 4 tables:

- customers
- order_items
- orders
- products

![Verifying the tables](/backend/e-commerce-app/internal/database/sql/img_for_readme/pgAdmin_004.png)

### Nicely Done! Good Job 🎉

You have created a PostgreSQL Database named "e_shop" that contains a schema of 4 tables and it's hosted locally on your machine.

You can now use your favorite PL to perform CRUD operation and queries against it!

Happy coding! 👩‍💻
