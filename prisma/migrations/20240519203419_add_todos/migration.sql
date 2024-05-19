-- CreateEnum
CREATE TYPE "ItemStatus" AS ENUM ('ACTIVE', 'COMPLETED', 'CANCELLED');

-- CreateTable
CREATE TABLE "TodoList" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TodoList_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserTodoList" (
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "todoListId" TEXT NOT NULL,

    CONSTRAINT "UserTodoList_pkey" PRIMARY KEY ("userId","todoListId")
);

-- CreateTable
CREATE TABLE "TodoItem" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "deadLine" TIMESTAMP(3) NOT NULL,
    "status" "ItemStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" TEXT NOT NULL,
    "todoListId" TEXT NOT NULL,

    CONSTRAINT "TodoItem_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "UserTodoList" ADD CONSTRAINT "UserTodoList_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserTodoList" ADD CONSTRAINT "UserTodoList_todoListId_fkey" FOREIGN KEY ("todoListId") REFERENCES "TodoList"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TodoItem" ADD CONSTRAINT "TodoItem_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TodoItem" ADD CONSTRAINT "TodoItem_todoListId_fkey" FOREIGN KEY ("todoListId") REFERENCES "TodoList"("id") ON DELETE CASCADE ON UPDATE CASCADE;
