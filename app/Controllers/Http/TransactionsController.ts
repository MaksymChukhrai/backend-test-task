// app/Controllers/Http/TransactionsController.ts
import RedisService from '../../Services/RedisService.js';
import QueueService from '../../Services/QueueService.js';

// Определяем наши собственные типы
interface HttpRequest {
  input(name: string, defaultValue?: any): any;
  only(fields: string[]): any;
  params?: any;
  body?: any;
}

interface HttpResponse {
  ok(data: any): any;
  notFound(data: any): any;
  badRequest(data: any): any;
  json(data: any): any;
  status(code: number): { json(data: any): any };
}

interface ControllerContext {
  request: HttpRequest;
  response: HttpResponse;
  params?: any;
}

export default class TransactionsController {
  /**
   * Получение списка транзакций с пагинацией
   */
  public async index({ request, response }: ControllerContext) {
    const page = request.input('page', 1);
    const limit = request.input('limit', 20);
    
    // Для демонстрации создаем тестовые данные
    const transactions = [];
    for (let i = 1; i <= 10; i++) {
      transactions.push({
        id: i,
        date: new Date().toISOString(),
        type: i % 2 === 0 ? 'income' : 'expense',
        price: i * 100,
        balance_after: i * 100
      });
    }
    
    return response.ok({
      data: transactions,
      meta: {
        total: 10,
        per_page: limit,
        current_page: page,
        last_page: 1
      }
    });
  }

  /**
   * Получение одной транзакции по ID
   */
  public async show({ params, response }: ControllerContext) {
    const id = parseInt(params.id);
    
    // Для демонстрации создаем тестовую транзакцию
    if (id > 0 && id <= 10) {
      const transaction = {
        id,
        date: new Date().toISOString(),
        type: id % 2 === 0 ? 'income' : 'expense',
        price: id * 100,
        balance_after: id * 100
      };
      
      return response.ok(transaction);
    }
    
    return response.notFound({ message: 'Transaction not found' });
  }

  /**
   * Получение статуса всех задач
   */
  public async getJobs({ response }: ControllerContext) {
    const queueService = QueueService.getInstance();
    const jobs = queueService.getAllJobs();
    
    return response.ok({ jobs });
  }

  /**
   * Получение статуса конкретной задачи
   */
  public async getJobStatus({ params, response }: ControllerContext) {
    const jobId = params.id;
    const queueService = QueueService.getInstance();
    const job = queueService.getJob(jobId);
    
    if (!job) {
      return response.notFound({ message: 'Job not found' });
    }
    
    return response.ok({ job });
  }

  /**
   * Обновление транзакции
   */
  public async update({ params, request, response }: ControllerContext) {
    const id = parseInt(params.id);
    
    // Простая валидация входящих данных
    const data = request.only(['price']);
    const newPrice = parseFloat(data.price);
    
    if (isNaN(newPrice) || newPrice <= 0) {
      return response.badRequest({ 
        message: 'Price must be a positive number' 
      });
    }
    
    // Для демонстрации создаем тестовую транзакцию
    if (id > 0 && id <= 10) {
      try {
        // Имитируем обновление транзакции
        const oldPrice = id * 100;  // Имитация текущей цены
        const priceDifference = newPrice - oldPrice;
        const balanceChange = id % 2 === 0 ? priceDifference : -priceDifference;
        
        // Обновляем текущую транзакцию
        const transaction = {
          id,
          date: new Date().toISOString(),
          type: id % 2 === 0 ? 'income' : 'expense',
          price: newPrice,
          balance_after: id % 2 === 0 ? id * 100 + priceDifference : id * 100 - priceDifference
        };
        
        // Сохраняем в Redis
        await RedisService.set(`transaction:${id}:balance`, transaction.balance_after.toString());
        
        // Создаем задачу для пересчета последующих транзакций в фоновом режиме
        const queueService = QueueService.getInstance();
        const job = await queueService.addJob('recalculateBalances', {
          transactionId: id,
          balanceChange
        });
        
        return response.ok({
          message: 'Transaction updated successfully',
          transaction,
          jobId: job.id  // Возвращаем ID задачи для проверки статуса
        });
      } catch (error) {
        console.error('Error updating transaction:', error);
        return response.status(500).json({ 
          error: 'Error updating transaction' 
        });
      }
    }
    
    return response.notFound({ message: 'Transaction not found' });
  }
}