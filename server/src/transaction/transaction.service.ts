import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { CreateTransactionDto } from './dto/create-transaction.dto'
import { UpdateTransactionDto } from './dto/update-transaction.dto'
import { Transaction } from './entities/transaction.entity'

@Injectable()
export class TransactionService {

	constructor(
		@InjectRepository(Transaction)
		private readonly transactionRepository: Repository<Transaction>,
	) {
	}

	async create(createTransactionDto: CreateTransactionDto, id: number) {

		const newTransaction = {
			title: createTransactionDto.title,
			amount: createTransactionDto.amount,
			type: createTransactionDto.type,
			category: { id: +createTransactionDto.category },
			user: { id },
		}

		if (!newTransaction) {
			throw new BadRequestException('Something went wrong...!')
		}

		return await this.transactionRepository.save(newTransaction)
	}

	async findAll(id: number) {
		return await this.transactionRepository.find({
			where: {
				user: { id },
			},
			order: {
				createdAt: 'DESC',
			},
		})
	}

	async findAllWithPagination(id: number, page: number, limit: number) {
		return await this.transactionRepository.find({
			where: {
				user: { id },
			},
			relations: {
				user: true,
				categories: true,
			},
			order: {
				createdAt: 'DESC',
			},
			take: limit,
			skip: (page - 1) * limit,
		})
	}

	async findOne(id: number) {
		const transaction = await this.transactionRepository.findOne({
			where: { id },
			relations: {
				user: true,
				categories: true,
			},
		})
		if (!transaction) throw new NotFoundException('Transaction not found!')

		return transaction
	}

	async update(id: number, updateTransactionDto: UpdateTransactionDto) {
		const transaction = await this.transactionRepository.findOne({
			where: { id },
		})
		if (!transaction) throw new NotFoundException('Transaction not found!')
		return await this.transactionRepository.update(id, updateTransactionDto)
	}

	async remove(id: number) {
		const transaction = await this.transactionRepository.findOne({
			where: { id },
		})
		if (!transaction) throw new NotFoundException('Transaction not found!')
		return await this.transactionRepository.delete(id)
	}

	async findAllByType(id: number, type: string) {
		const transactions = await this.transactionRepository.find({
			where: {
				user: { id },
				type,
			},
		})

		return transactions.reduce((acc, obj) => acc + obj.amount, 0)
	}
}
