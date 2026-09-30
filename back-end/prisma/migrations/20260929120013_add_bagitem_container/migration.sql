-- AlterTable
ALTER TABLE "BagItem" ADD COLUMN     "containerItemId" INTEGER;

-- AddForeignKey
ALTER TABLE "BagItem" ADD CONSTRAINT "BagItem_bagId_containerItemId_fkey" FOREIGN KEY ("bagId", "containerItemId") REFERENCES "BagItem"("bagId", "itemId") ON DELETE RESTRICT ON UPDATE CASCADE;
