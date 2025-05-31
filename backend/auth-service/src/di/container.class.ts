import { Consumer, Producer } from "kafkajs";
import { Sequelize } from "sequelize";
import { SagaManager } from "shared/common/saga/sagaManager";
import { SagaWaiter } from "shared/common/saga/sagaWaiter";
import sequelize from "src/db/config/sequelize";
import { kafka } from "src/kafka/config/kafka.config";
import { AuthConsumer } from "src/kafka/consumers/auth.consumer";
import { SagaReplyConsumer } from "src/kafka/consumers/sagaReply.consumer";
import { KafkaService } from "src/kafka/kafka.service";
import { AuthProducer } from "src/kafka/produsers/auth.producer";
import { AuthService } from "src/services/auth.service";
import { PasswordService } from "src/services/password.service";
import { TokenService } from "src/services/token.service";
import { UserService } from "src/services/user.service";

export class Container {
    private _sequelize: Sequelize;

    private _authService: AuthService;
    private _passwordService: PasswordService;
    private _tokenService: TokenService;
    private _userService: UserService;

    private _kafkaProducer: Producer;
    private _kafkaConsumer: Consumer;

    private _sagaManager: SagaManager;
    private _sagaWaiter: SagaWaiter;

    private _kafkaService: KafkaService;

    private _authProducer: AuthProducer;
    private _authConsumer: AuthConsumer;

    private _SagaReplyConsumer: SagaReplyConsumer;

    constructor() {
        this._sequelize = sequelize
        this._passwordService = new PasswordService()
        this._tokenService = new TokenService()
        this._userService = new UserService()

        this._kafkaProducer = kafka.producer()
        this._kafkaConsumer = kafka.consumer({ groupId: 'auth-group' })

        this._sagaManager = new SagaManager()
        this._sagaWaiter = new SagaWaiter()

        this._kafkaService = new KafkaService(this._kafkaProducer, this._kafkaConsumer)

        this._authProducer = new AuthProducer(this._kafkaProducer)
        this._authConsumer = new AuthConsumer(this._userService)

        this._SagaReplyConsumer = new SagaReplyConsumer(this._sagaWaiter)

        this._authService = new AuthService(
            this._sequelize,
            this._userService,
            this._passwordService,
            this._tokenService,
            this._authProducer,
            this._sagaWaiter
        )
    }

    getKafkaService() { return this._kafkaService }
    getAuthService() { return this._authService }

    getAuthConsumer() { return this._authConsumer }
    getSagaReplyConsumer() { return this._SagaReplyConsumer }

    getSagaWaiter() { return this._sagaWaiter }
    getSagaManager() { return this._sagaManager }
}