import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { CategoryService } from './category.service'
import { CategoryController } from './category.controller'
import { Category } from './entities/category.entity'
import { Transaction } from '../transaction/entities/transaction.entity'
import { TransactionService } from '../transaction/transaction.service'

@Module({
	imports: [TypeOrmModule.forFeature([Category, Transaction])],
	controllers: [CategoryController],
	providers: [CategoryService, TransactionService],
})
export class CategoryModule {
}
