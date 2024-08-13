# How to setup a PostgreSQL DB using pgAdmin4

### 1. Download and Install PostgreSQL

- [PostgreSQL - Official Page](https://www.enterprisedb.com/downloads/postgres-postgresql-downloads)

**PostgreSQL** is the app/service that will run on your computer in the background.

We can use through their CLI tool, but a GUI tool offers a better Developer Experience, therefore we shall use:

**pgAdmin** a GUI (Graphical User Interface) tool for PostgreSQL. It makes it a lot easier to create and manage our PostgreSQL databases.

> ## Don't like reading? Me too!

> Check my [video tutorial](https://youtu.be/bAkFfh0kU7s) in Youtube 📹

**⚠ Very Important** 

In the installation Wizard, you will be asked to provide 2 things:

1. The Super-User (postgres) *Password*, insert this: **12345678!@#** 
2. The *Port*, leave it as is: **5432** 

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

### Making our Developing Life easier...

Most of the time when trying to connect with Databases for the very first time a lot of authentication errors start to pop-up.

Therefore, I recommend turning off a couple of security features to drasticly decrease the amount of headaches and broken montiors.

1. **Turning off SSL**

   - This can be achieved by navigating into the PostgreSQL's installation folder. For Windows users, this should be here: `C:\Program Files\PostgreSQL\16\data\postgresql.conf`
   - Open it with VS Code or something similar, and find the line that says "#ssl = off"
   - Simply remove the '#', aka uncomment that line of code.
   - Finally, you need to restart the running PostgreSQL Service. For Windows, write "Services" in the windows search bar. Then find the "postgresql-x64-{version}" service, select it and then click on Restart service

   ![Restarting Service](/backend/e-commerce-app/internal/database/sql/img_for_readme/pgAdmin_005.png)

2. **Turning off Password Auth**

   - For this go to the same PostgreSQL directory as before: `C:\Program Files\PostgreSQL\16\data\postgresql.conf`
   - Find and Open the `pg_hba.conf` file
   - Scroll all the way down until you see some uncommented code
   - Change whatever is under the "METHOD" Column to 'trust'
   - Super Important, you must **Restart the Service** as shown previously in "Turning off SSL"

     ![No Password Auth](/backend/e-commerce-app/internal/database/sql/img_for_readme/pgAdmin_006.png)

### Nicely Done! Good Job 🎉

You have created a PostgreSQL Database named "e_shop" that contains a schema of 4 tables and it's hosted locally on your machine.

You can now use your favorite PL to perform CRUD operation and queries against it!

Happy coding! 👩‍💻
