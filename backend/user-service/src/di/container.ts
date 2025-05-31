import { Consumer, Producer } from "kafkajs";
import { Sequelize } from "sequelize";
import sequelize from "src/db/config/sequelize";
import { kafka } from "src/kafka/config/kafka.config";
import { AuthConsumer } from "src/kafka/consumers/auth.consumer";
import { KafkaService } from "src/kafka/kafka.service";
import { AuthProducer } from "src/kafka/producers/auth.producer";
import { UserService } from "src/services/user.service";

export class Container {
    private _sequelize: Sequelize;

    private _kafkaProducer: Producer;
    private _kafkaConsumer: Consumer;

    private _userService: UserService;
    private _kafkaService: KafkaService;
    
    private _authProducer: AuthProducer;
    private _authConsumer: AuthConsumer;

    constructor() {
        this._sequelize = sequelize

        this._kafkaProducer = kafka.producer()
        this._kafkaConsumer = kafka.consumer({ groupId: 'user-group' })

        this._authProducer = new AuthProducer(this._kafkaProducer)

        this._userService = new UserService(this._sequelize, this._authProducer)

        this._authConsumer = new AuthConsumer(this._userService)

        this._kafkaService = new KafkaService(this._kafkaProducer, this._kafkaConsumer)
    }

    getUserService() { return this._userService }
    getKafkaService() { return this._kafkaService }
    getAuthProducer() { return this._authProducer }
    getAuthConsumer() { return this._authConsumer }
}