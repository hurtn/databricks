DROP TABLE IF EXISTS dbo.domains
GO
CREATE TABLE dbo.domains
   (ID int PRIMARY KEY NOT NULL,  
   Domain varchar(256) NOT NULL)  
GO  
insert into dbo.domains values (1, 'site1.com')
GO
insert into dbo.domains values (2, 'site2.com')
GO
insert into dbo.domains values (3, 'site3.com')
GO
insert into dbo.domains values (4, 'site4.com')
GO
insert into dbo.domains values (5, 'site5.com')
GO
insert into dbo.domains values (6, 'site6.com')
GO
insert into dbo.domains values (7, 'site7.com')
GO
insert into dbo.domains values (8, 'site8.com')
GO
insert into dbo.domains values (9, 'site9.com')
GO
insert into dbo.domains values (10, 'site10.com')
GO
