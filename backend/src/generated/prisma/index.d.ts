
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model Pagamento
 * 
 */
export type Pagamento = $Result.DefaultSelection<Prisma.$PagamentoPayload>
/**
 * Model Inventario
 * 
 */
export type Inventario = $Result.DefaultSelection<Prisma.$InventarioPayload>
/**
 * Model Funcionario
 * 
 */
export type Funcionario = $Result.DefaultSelection<Prisma.$FuncionarioPayload>
/**
 * Model ControleJornada
 * 
 */
export type ControleJornada = $Result.DefaultSelection<Prisma.$ControleJornadaPayload>
/**
 * Model ResumoPagamento
 * 
 */
export type ResumoPagamento = $Result.DefaultSelection<Prisma.$ResumoPagamentoPayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.pagamento`: Exposes CRUD operations for the **Pagamento** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Pagamentos
    * const pagamentos = await prisma.pagamento.findMany()
    * ```
    */
  get pagamento(): Prisma.PagamentoDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.inventario`: Exposes CRUD operations for the **Inventario** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Inventarios
    * const inventarios = await prisma.inventario.findMany()
    * ```
    */
  get inventario(): Prisma.InventarioDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.funcionario`: Exposes CRUD operations for the **Funcionario** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Funcionarios
    * const funcionarios = await prisma.funcionario.findMany()
    * ```
    */
  get funcionario(): Prisma.FuncionarioDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.controleJornada`: Exposes CRUD operations for the **ControleJornada** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ControleJornadas
    * const controleJornadas = await prisma.controleJornada.findMany()
    * ```
    */
  get controleJornada(): Prisma.ControleJornadaDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.resumoPagamento`: Exposes CRUD operations for the **ResumoPagamento** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ResumoPagamentos
    * const resumoPagamentos = await prisma.resumoPagamento.findMany()
    * ```
    */
  get resumoPagamento(): Prisma.ResumoPagamentoDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.6.0
   * Query Engine version: f676762280b54cd07c770017ed3711ddde35f37a
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    User: 'User',
    Pagamento: 'Pagamento',
    Inventario: 'Inventario',
    Funcionario: 'Funcionario',
    ControleJornada: 'ControleJornada',
    ResumoPagamento: 'ResumoPagamento'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "user" | "pagamento" | "inventario" | "funcionario" | "controleJornada" | "resumoPagamento"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      Pagamento: {
        payload: Prisma.$PagamentoPayload<ExtArgs>
        fields: Prisma.PagamentoFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PagamentoFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PagamentoPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PagamentoFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PagamentoPayload>
          }
          findFirst: {
            args: Prisma.PagamentoFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PagamentoPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PagamentoFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PagamentoPayload>
          }
          findMany: {
            args: Prisma.PagamentoFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PagamentoPayload>[]
          }
          create: {
            args: Prisma.PagamentoCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PagamentoPayload>
          }
          createMany: {
            args: Prisma.PagamentoCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PagamentoCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PagamentoPayload>[]
          }
          delete: {
            args: Prisma.PagamentoDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PagamentoPayload>
          }
          update: {
            args: Prisma.PagamentoUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PagamentoPayload>
          }
          deleteMany: {
            args: Prisma.PagamentoDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PagamentoUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.PagamentoUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PagamentoPayload>[]
          }
          upsert: {
            args: Prisma.PagamentoUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PagamentoPayload>
          }
          aggregate: {
            args: Prisma.PagamentoAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePagamento>
          }
          groupBy: {
            args: Prisma.PagamentoGroupByArgs<ExtArgs>
            result: $Utils.Optional<PagamentoGroupByOutputType>[]
          }
          count: {
            args: Prisma.PagamentoCountArgs<ExtArgs>
            result: $Utils.Optional<PagamentoCountAggregateOutputType> | number
          }
        }
      }
      Inventario: {
        payload: Prisma.$InventarioPayload<ExtArgs>
        fields: Prisma.InventarioFieldRefs
        operations: {
          findUnique: {
            args: Prisma.InventarioFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InventarioPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.InventarioFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InventarioPayload>
          }
          findFirst: {
            args: Prisma.InventarioFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InventarioPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.InventarioFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InventarioPayload>
          }
          findMany: {
            args: Prisma.InventarioFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InventarioPayload>[]
          }
          create: {
            args: Prisma.InventarioCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InventarioPayload>
          }
          createMany: {
            args: Prisma.InventarioCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.InventarioCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InventarioPayload>[]
          }
          delete: {
            args: Prisma.InventarioDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InventarioPayload>
          }
          update: {
            args: Prisma.InventarioUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InventarioPayload>
          }
          deleteMany: {
            args: Prisma.InventarioDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.InventarioUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.InventarioUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InventarioPayload>[]
          }
          upsert: {
            args: Prisma.InventarioUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InventarioPayload>
          }
          aggregate: {
            args: Prisma.InventarioAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateInventario>
          }
          groupBy: {
            args: Prisma.InventarioGroupByArgs<ExtArgs>
            result: $Utils.Optional<InventarioGroupByOutputType>[]
          }
          count: {
            args: Prisma.InventarioCountArgs<ExtArgs>
            result: $Utils.Optional<InventarioCountAggregateOutputType> | number
          }
        }
      }
      Funcionario: {
        payload: Prisma.$FuncionarioPayload<ExtArgs>
        fields: Prisma.FuncionarioFieldRefs
        operations: {
          findUnique: {
            args: Prisma.FuncionarioFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FuncionarioPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.FuncionarioFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FuncionarioPayload>
          }
          findFirst: {
            args: Prisma.FuncionarioFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FuncionarioPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.FuncionarioFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FuncionarioPayload>
          }
          findMany: {
            args: Prisma.FuncionarioFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FuncionarioPayload>[]
          }
          create: {
            args: Prisma.FuncionarioCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FuncionarioPayload>
          }
          createMany: {
            args: Prisma.FuncionarioCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.FuncionarioCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FuncionarioPayload>[]
          }
          delete: {
            args: Prisma.FuncionarioDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FuncionarioPayload>
          }
          update: {
            args: Prisma.FuncionarioUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FuncionarioPayload>
          }
          deleteMany: {
            args: Prisma.FuncionarioDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.FuncionarioUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.FuncionarioUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FuncionarioPayload>[]
          }
          upsert: {
            args: Prisma.FuncionarioUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FuncionarioPayload>
          }
          aggregate: {
            args: Prisma.FuncionarioAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateFuncionario>
          }
          groupBy: {
            args: Prisma.FuncionarioGroupByArgs<ExtArgs>
            result: $Utils.Optional<FuncionarioGroupByOutputType>[]
          }
          count: {
            args: Prisma.FuncionarioCountArgs<ExtArgs>
            result: $Utils.Optional<FuncionarioCountAggregateOutputType> | number
          }
        }
      }
      ControleJornada: {
        payload: Prisma.$ControleJornadaPayload<ExtArgs>
        fields: Prisma.ControleJornadaFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ControleJornadaFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ControleJornadaPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ControleJornadaFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ControleJornadaPayload>
          }
          findFirst: {
            args: Prisma.ControleJornadaFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ControleJornadaPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ControleJornadaFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ControleJornadaPayload>
          }
          findMany: {
            args: Prisma.ControleJornadaFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ControleJornadaPayload>[]
          }
          create: {
            args: Prisma.ControleJornadaCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ControleJornadaPayload>
          }
          createMany: {
            args: Prisma.ControleJornadaCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ControleJornadaCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ControleJornadaPayload>[]
          }
          delete: {
            args: Prisma.ControleJornadaDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ControleJornadaPayload>
          }
          update: {
            args: Prisma.ControleJornadaUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ControleJornadaPayload>
          }
          deleteMany: {
            args: Prisma.ControleJornadaDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ControleJornadaUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ControleJornadaUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ControleJornadaPayload>[]
          }
          upsert: {
            args: Prisma.ControleJornadaUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ControleJornadaPayload>
          }
          aggregate: {
            args: Prisma.ControleJornadaAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateControleJornada>
          }
          groupBy: {
            args: Prisma.ControleJornadaGroupByArgs<ExtArgs>
            result: $Utils.Optional<ControleJornadaGroupByOutputType>[]
          }
          count: {
            args: Prisma.ControleJornadaCountArgs<ExtArgs>
            result: $Utils.Optional<ControleJornadaCountAggregateOutputType> | number
          }
        }
      }
      ResumoPagamento: {
        payload: Prisma.$ResumoPagamentoPayload<ExtArgs>
        fields: Prisma.ResumoPagamentoFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ResumoPagamentoFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ResumoPagamentoPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ResumoPagamentoFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ResumoPagamentoPayload>
          }
          findFirst: {
            args: Prisma.ResumoPagamentoFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ResumoPagamentoPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ResumoPagamentoFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ResumoPagamentoPayload>
          }
          findMany: {
            args: Prisma.ResumoPagamentoFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ResumoPagamentoPayload>[]
          }
          create: {
            args: Prisma.ResumoPagamentoCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ResumoPagamentoPayload>
          }
          createMany: {
            args: Prisma.ResumoPagamentoCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ResumoPagamentoCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ResumoPagamentoPayload>[]
          }
          delete: {
            args: Prisma.ResumoPagamentoDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ResumoPagamentoPayload>
          }
          update: {
            args: Prisma.ResumoPagamentoUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ResumoPagamentoPayload>
          }
          deleteMany: {
            args: Prisma.ResumoPagamentoDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ResumoPagamentoUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ResumoPagamentoUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ResumoPagamentoPayload>[]
          }
          upsert: {
            args: Prisma.ResumoPagamentoUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ResumoPagamentoPayload>
          }
          aggregate: {
            args: Prisma.ResumoPagamentoAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateResumoPagamento>
          }
          groupBy: {
            args: Prisma.ResumoPagamentoGroupByArgs<ExtArgs>
            result: $Utils.Optional<ResumoPagamentoGroupByOutputType>[]
          }
          count: {
            args: Prisma.ResumoPagamentoCountArgs<ExtArgs>
            result: $Utils.Optional<ResumoPagamentoCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *   { emit: 'stdout', level: 'query' },
     *   { emit: 'stdout', level: 'info' },
     *   { emit: 'stdout', level: 'warn' }
     *   { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    user?: UserOmit
    pagamento?: PagamentoOmit
    inventario?: InventarioOmit
    funcionario?: FuncionarioOmit
    controleJornada?: ControleJornadaOmit
    resumoPagamento?: ResumoPagamentoOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    pagamentos: number
    inventario: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    pagamentos?: boolean | UserCountOutputTypeCountPagamentosArgs
    inventario?: boolean | UserCountOutputTypeCountInventarioArgs
  }

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountPagamentosArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PagamentoWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountInventarioArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: InventarioWhereInput
  }


  /**
   * Count Type FuncionarioCountOutputType
   */

  export type FuncionarioCountOutputType = {
    controleJornada: number
    resumoPagamento: number
  }

  export type FuncionarioCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    controleJornada?: boolean | FuncionarioCountOutputTypeCountControleJornadaArgs
    resumoPagamento?: boolean | FuncionarioCountOutputTypeCountResumoPagamentoArgs
  }

  // Custom InputTypes
  /**
   * FuncionarioCountOutputType without action
   */
  export type FuncionarioCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FuncionarioCountOutputType
     */
    select?: FuncionarioCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * FuncionarioCountOutputType without action
   */
  export type FuncionarioCountOutputTypeCountControleJornadaArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ControleJornadaWhereInput
  }

  /**
   * FuncionarioCountOutputType without action
   */
  export type FuncionarioCountOutputTypeCountResumoPagamentoArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ResumoPagamentoWhereInput
  }


  /**
   * Models
   */

  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _avg: UserAvgAggregateOutputType | null
    _sum: UserSumAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserAvgAggregateOutputType = {
    numeroFuncionarios: number | null
  }

  export type UserSumAggregateOutputType = {
    numeroFuncionarios: number | null
  }

  export type UserMinAggregateOutputType = {
    id: string | null
    nome: string | null
    email: string | null
    cargo: string | null
    telefone: string | null
    setor: string | null
    password: string | null
    permissoes: string | null
    tipoNegocio: string | null
    numeroFuncionarios: number | null
    passwordResetToken: string | null
    passwordResetExpires: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
    nome: string | null
    email: string | null
    cargo: string | null
    telefone: string | null
    setor: string | null
    password: string | null
    permissoes: string | null
    tipoNegocio: string | null
    numeroFuncionarios: number | null
    passwordResetToken: string | null
    passwordResetExpires: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    nome: number
    email: number
    cargo: number
    telefone: number
    setor: number
    password: number
    permissoes: number
    tipoNegocio: number
    numeroFuncionarios: number
    passwordResetToken: number
    passwordResetExpires: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type UserAvgAggregateInputType = {
    numeroFuncionarios?: true
  }

  export type UserSumAggregateInputType = {
    numeroFuncionarios?: true
  }

  export type UserMinAggregateInputType = {
    id?: true
    nome?: true
    email?: true
    cargo?: true
    telefone?: true
    setor?: true
    password?: true
    permissoes?: true
    tipoNegocio?: true
    numeroFuncionarios?: true
    passwordResetToken?: true
    passwordResetExpires?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    nome?: true
    email?: true
    cargo?: true
    telefone?: true
    setor?: true
    password?: true
    permissoes?: true
    tipoNegocio?: true
    numeroFuncionarios?: true
    passwordResetToken?: true
    passwordResetExpires?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    nome?: true
    email?: true
    cargo?: true
    telefone?: true
    setor?: true
    password?: true
    permissoes?: true
    tipoNegocio?: true
    numeroFuncionarios?: true
    passwordResetToken?: true
    passwordResetExpires?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: UserAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: UserSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _avg?: UserAvgAggregateInputType
    _sum?: UserSumAggregateInputType
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: string
    nome: string
    email: string
    cargo: string | null
    telefone: string | null
    setor: string | null
    password: string
    permissoes: string
    tipoNegocio: string | null
    numeroFuncionarios: number | null
    passwordResetToken: string | null
    passwordResetExpires: Date | null
    createdAt: Date
    updatedAt: Date
    _count: UserCountAggregateOutputType | null
    _avg: UserAvgAggregateOutputType | null
    _sum: UserSumAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    nome?: boolean
    email?: boolean
    cargo?: boolean
    telefone?: boolean
    setor?: boolean
    password?: boolean
    permissoes?: boolean
    tipoNegocio?: boolean
    numeroFuncionarios?: boolean
    passwordResetToken?: boolean
    passwordResetExpires?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    pagamentos?: boolean | User$pagamentosArgs<ExtArgs>
    inventario?: boolean | User$inventarioArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    nome?: boolean
    email?: boolean
    cargo?: boolean
    telefone?: boolean
    setor?: boolean
    password?: boolean
    permissoes?: boolean
    tipoNegocio?: boolean
    numeroFuncionarios?: boolean
    passwordResetToken?: boolean
    passwordResetExpires?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    nome?: boolean
    email?: boolean
    cargo?: boolean
    telefone?: boolean
    setor?: boolean
    password?: boolean
    permissoes?: boolean
    tipoNegocio?: boolean
    numeroFuncionarios?: boolean
    passwordResetToken?: boolean
    passwordResetExpires?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    nome?: boolean
    email?: boolean
    cargo?: boolean
    telefone?: boolean
    setor?: boolean
    password?: boolean
    permissoes?: boolean
    tipoNegocio?: boolean
    numeroFuncionarios?: boolean
    passwordResetToken?: boolean
    passwordResetExpires?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type UserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "nome" | "email" | "cargo" | "telefone" | "setor" | "password" | "permissoes" | "tipoNegocio" | "numeroFuncionarios" | "passwordResetToken" | "passwordResetExpires" | "createdAt" | "updatedAt", ExtArgs["result"]["user"]>
  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    pagamentos?: boolean | User$pagamentosArgs<ExtArgs>
    inventario?: boolean | User$inventarioArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type UserIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      pagamentos: Prisma.$PagamentoPayload<ExtArgs>[]
      inventario: Prisma.$InventarioPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      nome: string
      email: string
      cargo: string | null
      telefone: string | null
      setor: string | null
      password: string
      permissoes: string
      tipoNegocio: string | null
      numeroFuncionarios: number | null
      passwordResetToken: string | null
      passwordResetExpires: Date | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users and returns the data updated in the database.
     * @param {UserUpdateManyAndReturnArgs} args - Arguments to update many Users.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Users and only return the `id`
     * const userWithIdOnly = await prisma.user.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UserUpdateManyAndReturnArgs>(args: SelectSubset<T, UserUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    pagamentos<T extends User$pagamentosArgs<ExtArgs> = {}>(args?: Subset<T, User$pagamentosArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PagamentoPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    inventario<T extends User$inventarioArgs<ExtArgs> = {}>(args?: Subset<T, User$inventarioArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InventarioPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the User model
   */
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'String'>
    readonly nome: FieldRef<"User", 'String'>
    readonly email: FieldRef<"User", 'String'>
    readonly cargo: FieldRef<"User", 'String'>
    readonly telefone: FieldRef<"User", 'String'>
    readonly setor: FieldRef<"User", 'String'>
    readonly password: FieldRef<"User", 'String'>
    readonly permissoes: FieldRef<"User", 'String'>
    readonly tipoNegocio: FieldRef<"User", 'String'>
    readonly numeroFuncionarios: FieldRef<"User", 'Int'>
    readonly passwordResetToken: FieldRef<"User", 'String'>
    readonly passwordResetExpires: FieldRef<"User", 'DateTime'>
    readonly createdAt: FieldRef<"User", 'DateTime'>
    readonly updatedAt: FieldRef<"User", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User updateManyAndReturn
   */
  export type UserUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to delete.
     */
    limit?: number
  }

  /**
   * User.pagamentos
   */
  export type User$pagamentosArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Pagamento
     */
    select?: PagamentoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Pagamento
     */
    omit?: PagamentoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PagamentoInclude<ExtArgs> | null
    where?: PagamentoWhereInput
    orderBy?: PagamentoOrderByWithRelationInput | PagamentoOrderByWithRelationInput[]
    cursor?: PagamentoWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PagamentoScalarFieldEnum | PagamentoScalarFieldEnum[]
  }

  /**
   * User.inventario
   */
  export type User$inventarioArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Inventario
     */
    select?: InventarioSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Inventario
     */
    omit?: InventarioOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InventarioInclude<ExtArgs> | null
    where?: InventarioWhereInput
    orderBy?: InventarioOrderByWithRelationInput | InventarioOrderByWithRelationInput[]
    cursor?: InventarioWhereUniqueInput
    take?: number
    skip?: number
    distinct?: InventarioScalarFieldEnum | InventarioScalarFieldEnum[]
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model Pagamento
   */

  export type AggregatePagamento = {
    _count: PagamentoCountAggregateOutputType | null
    _avg: PagamentoAvgAggregateOutputType | null
    _sum: PagamentoSumAggregateOutputType | null
    _min: PagamentoMinAggregateOutputType | null
    _max: PagamentoMaxAggregateOutputType | null
  }

  export type PagamentoAvgAggregateOutputType = {
    valor: number | null
  }

  export type PagamentoSumAggregateOutputType = {
    valor: number | null
  }

  export type PagamentoMinAggregateOutputType = {
    id: string | null
    valor: number | null
    data: Date | null
    status: string | null
    descricao: string | null
    userId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type PagamentoMaxAggregateOutputType = {
    id: string | null
    valor: number | null
    data: Date | null
    status: string | null
    descricao: string | null
    userId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type PagamentoCountAggregateOutputType = {
    id: number
    valor: number
    data: number
    status: number
    descricao: number
    userId: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type PagamentoAvgAggregateInputType = {
    valor?: true
  }

  export type PagamentoSumAggregateInputType = {
    valor?: true
  }

  export type PagamentoMinAggregateInputType = {
    id?: true
    valor?: true
    data?: true
    status?: true
    descricao?: true
    userId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type PagamentoMaxAggregateInputType = {
    id?: true
    valor?: true
    data?: true
    status?: true
    descricao?: true
    userId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type PagamentoCountAggregateInputType = {
    id?: true
    valor?: true
    data?: true
    status?: true
    descricao?: true
    userId?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type PagamentoAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Pagamento to aggregate.
     */
    where?: PagamentoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Pagamentos to fetch.
     */
    orderBy?: PagamentoOrderByWithRelationInput | PagamentoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PagamentoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Pagamentos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Pagamentos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Pagamentos
    **/
    _count?: true | PagamentoCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: PagamentoAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: PagamentoSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PagamentoMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PagamentoMaxAggregateInputType
  }

  export type GetPagamentoAggregateType<T extends PagamentoAggregateArgs> = {
        [P in keyof T & keyof AggregatePagamento]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePagamento[P]>
      : GetScalarType<T[P], AggregatePagamento[P]>
  }




  export type PagamentoGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PagamentoWhereInput
    orderBy?: PagamentoOrderByWithAggregationInput | PagamentoOrderByWithAggregationInput[]
    by: PagamentoScalarFieldEnum[] | PagamentoScalarFieldEnum
    having?: PagamentoScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PagamentoCountAggregateInputType | true
    _avg?: PagamentoAvgAggregateInputType
    _sum?: PagamentoSumAggregateInputType
    _min?: PagamentoMinAggregateInputType
    _max?: PagamentoMaxAggregateInputType
  }

  export type PagamentoGroupByOutputType = {
    id: string
    valor: number
    data: Date
    status: string
    descricao: string | null
    userId: string
    createdAt: Date
    updatedAt: Date
    _count: PagamentoCountAggregateOutputType | null
    _avg: PagamentoAvgAggregateOutputType | null
    _sum: PagamentoSumAggregateOutputType | null
    _min: PagamentoMinAggregateOutputType | null
    _max: PagamentoMaxAggregateOutputType | null
  }

  type GetPagamentoGroupByPayload<T extends PagamentoGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PagamentoGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PagamentoGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PagamentoGroupByOutputType[P]>
            : GetScalarType<T[P], PagamentoGroupByOutputType[P]>
        }
      >
    >


  export type PagamentoSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    valor?: boolean
    data?: boolean
    status?: boolean
    descricao?: boolean
    userId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["pagamento"]>

  export type PagamentoSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    valor?: boolean
    data?: boolean
    status?: boolean
    descricao?: boolean
    userId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["pagamento"]>

  export type PagamentoSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    valor?: boolean
    data?: boolean
    status?: boolean
    descricao?: boolean
    userId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["pagamento"]>

  export type PagamentoSelectScalar = {
    id?: boolean
    valor?: boolean
    data?: boolean
    status?: boolean
    descricao?: boolean
    userId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type PagamentoOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "valor" | "data" | "status" | "descricao" | "userId" | "createdAt" | "updatedAt", ExtArgs["result"]["pagamento"]>
  export type PagamentoInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type PagamentoIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type PagamentoIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $PagamentoPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Pagamento"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      valor: number
      data: Date
      status: string
      descricao: string | null
      userId: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["pagamento"]>
    composites: {}
  }

  type PagamentoGetPayload<S extends boolean | null | undefined | PagamentoDefaultArgs> = $Result.GetResult<Prisma.$PagamentoPayload, S>

  type PagamentoCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PagamentoFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PagamentoCountAggregateInputType | true
    }

  export interface PagamentoDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Pagamento'], meta: { name: 'Pagamento' } }
    /**
     * Find zero or one Pagamento that matches the filter.
     * @param {PagamentoFindUniqueArgs} args - Arguments to find a Pagamento
     * @example
     * // Get one Pagamento
     * const pagamento = await prisma.pagamento.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PagamentoFindUniqueArgs>(args: SelectSubset<T, PagamentoFindUniqueArgs<ExtArgs>>): Prisma__PagamentoClient<$Result.GetResult<Prisma.$PagamentoPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Pagamento that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PagamentoFindUniqueOrThrowArgs} args - Arguments to find a Pagamento
     * @example
     * // Get one Pagamento
     * const pagamento = await prisma.pagamento.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PagamentoFindUniqueOrThrowArgs>(args: SelectSubset<T, PagamentoFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PagamentoClient<$Result.GetResult<Prisma.$PagamentoPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Pagamento that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PagamentoFindFirstArgs} args - Arguments to find a Pagamento
     * @example
     * // Get one Pagamento
     * const pagamento = await prisma.pagamento.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PagamentoFindFirstArgs>(args?: SelectSubset<T, PagamentoFindFirstArgs<ExtArgs>>): Prisma__PagamentoClient<$Result.GetResult<Prisma.$PagamentoPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Pagamento that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PagamentoFindFirstOrThrowArgs} args - Arguments to find a Pagamento
     * @example
     * // Get one Pagamento
     * const pagamento = await prisma.pagamento.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PagamentoFindFirstOrThrowArgs>(args?: SelectSubset<T, PagamentoFindFirstOrThrowArgs<ExtArgs>>): Prisma__PagamentoClient<$Result.GetResult<Prisma.$PagamentoPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Pagamentos that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PagamentoFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Pagamentos
     * const pagamentos = await prisma.pagamento.findMany()
     * 
     * // Get first 10 Pagamentos
     * const pagamentos = await prisma.pagamento.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const pagamentoWithIdOnly = await prisma.pagamento.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PagamentoFindManyArgs>(args?: SelectSubset<T, PagamentoFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PagamentoPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Pagamento.
     * @param {PagamentoCreateArgs} args - Arguments to create a Pagamento.
     * @example
     * // Create one Pagamento
     * const Pagamento = await prisma.pagamento.create({
     *   data: {
     *     // ... data to create a Pagamento
     *   }
     * })
     * 
     */
    create<T extends PagamentoCreateArgs>(args: SelectSubset<T, PagamentoCreateArgs<ExtArgs>>): Prisma__PagamentoClient<$Result.GetResult<Prisma.$PagamentoPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Pagamentos.
     * @param {PagamentoCreateManyArgs} args - Arguments to create many Pagamentos.
     * @example
     * // Create many Pagamentos
     * const pagamento = await prisma.pagamento.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PagamentoCreateManyArgs>(args?: SelectSubset<T, PagamentoCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Pagamentos and returns the data saved in the database.
     * @param {PagamentoCreateManyAndReturnArgs} args - Arguments to create many Pagamentos.
     * @example
     * // Create many Pagamentos
     * const pagamento = await prisma.pagamento.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Pagamentos and only return the `id`
     * const pagamentoWithIdOnly = await prisma.pagamento.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PagamentoCreateManyAndReturnArgs>(args?: SelectSubset<T, PagamentoCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PagamentoPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Pagamento.
     * @param {PagamentoDeleteArgs} args - Arguments to delete one Pagamento.
     * @example
     * // Delete one Pagamento
     * const Pagamento = await prisma.pagamento.delete({
     *   where: {
     *     // ... filter to delete one Pagamento
     *   }
     * })
     * 
     */
    delete<T extends PagamentoDeleteArgs>(args: SelectSubset<T, PagamentoDeleteArgs<ExtArgs>>): Prisma__PagamentoClient<$Result.GetResult<Prisma.$PagamentoPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Pagamento.
     * @param {PagamentoUpdateArgs} args - Arguments to update one Pagamento.
     * @example
     * // Update one Pagamento
     * const pagamento = await prisma.pagamento.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PagamentoUpdateArgs>(args: SelectSubset<T, PagamentoUpdateArgs<ExtArgs>>): Prisma__PagamentoClient<$Result.GetResult<Prisma.$PagamentoPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Pagamentos.
     * @param {PagamentoDeleteManyArgs} args - Arguments to filter Pagamentos to delete.
     * @example
     * // Delete a few Pagamentos
     * const { count } = await prisma.pagamento.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PagamentoDeleteManyArgs>(args?: SelectSubset<T, PagamentoDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Pagamentos.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PagamentoUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Pagamentos
     * const pagamento = await prisma.pagamento.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PagamentoUpdateManyArgs>(args: SelectSubset<T, PagamentoUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Pagamentos and returns the data updated in the database.
     * @param {PagamentoUpdateManyAndReturnArgs} args - Arguments to update many Pagamentos.
     * @example
     * // Update many Pagamentos
     * const pagamento = await prisma.pagamento.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Pagamentos and only return the `id`
     * const pagamentoWithIdOnly = await prisma.pagamento.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends PagamentoUpdateManyAndReturnArgs>(args: SelectSubset<T, PagamentoUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PagamentoPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Pagamento.
     * @param {PagamentoUpsertArgs} args - Arguments to update or create a Pagamento.
     * @example
     * // Update or create a Pagamento
     * const pagamento = await prisma.pagamento.upsert({
     *   create: {
     *     // ... data to create a Pagamento
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Pagamento we want to update
     *   }
     * })
     */
    upsert<T extends PagamentoUpsertArgs>(args: SelectSubset<T, PagamentoUpsertArgs<ExtArgs>>): Prisma__PagamentoClient<$Result.GetResult<Prisma.$PagamentoPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Pagamentos.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PagamentoCountArgs} args - Arguments to filter Pagamentos to count.
     * @example
     * // Count the number of Pagamentos
     * const count = await prisma.pagamento.count({
     *   where: {
     *     // ... the filter for the Pagamentos we want to count
     *   }
     * })
    **/
    count<T extends PagamentoCountArgs>(
      args?: Subset<T, PagamentoCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PagamentoCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Pagamento.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PagamentoAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PagamentoAggregateArgs>(args: Subset<T, PagamentoAggregateArgs>): Prisma.PrismaPromise<GetPagamentoAggregateType<T>>

    /**
     * Group by Pagamento.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PagamentoGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PagamentoGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PagamentoGroupByArgs['orderBy'] }
        : { orderBy?: PagamentoGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PagamentoGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPagamentoGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Pagamento model
   */
  readonly fields: PagamentoFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Pagamento.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PagamentoClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Pagamento model
   */
  interface PagamentoFieldRefs {
    readonly id: FieldRef<"Pagamento", 'String'>
    readonly valor: FieldRef<"Pagamento", 'Float'>
    readonly data: FieldRef<"Pagamento", 'DateTime'>
    readonly status: FieldRef<"Pagamento", 'String'>
    readonly descricao: FieldRef<"Pagamento", 'String'>
    readonly userId: FieldRef<"Pagamento", 'String'>
    readonly createdAt: FieldRef<"Pagamento", 'DateTime'>
    readonly updatedAt: FieldRef<"Pagamento", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Pagamento findUnique
   */
  export type PagamentoFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Pagamento
     */
    select?: PagamentoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Pagamento
     */
    omit?: PagamentoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PagamentoInclude<ExtArgs> | null
    /**
     * Filter, which Pagamento to fetch.
     */
    where: PagamentoWhereUniqueInput
  }

  /**
   * Pagamento findUniqueOrThrow
   */
  export type PagamentoFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Pagamento
     */
    select?: PagamentoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Pagamento
     */
    omit?: PagamentoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PagamentoInclude<ExtArgs> | null
    /**
     * Filter, which Pagamento to fetch.
     */
    where: PagamentoWhereUniqueInput
  }

  /**
   * Pagamento findFirst
   */
  export type PagamentoFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Pagamento
     */
    select?: PagamentoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Pagamento
     */
    omit?: PagamentoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PagamentoInclude<ExtArgs> | null
    /**
     * Filter, which Pagamento to fetch.
     */
    where?: PagamentoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Pagamentos to fetch.
     */
    orderBy?: PagamentoOrderByWithRelationInput | PagamentoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Pagamentos.
     */
    cursor?: PagamentoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Pagamentos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Pagamentos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Pagamentos.
     */
    distinct?: PagamentoScalarFieldEnum | PagamentoScalarFieldEnum[]
  }

  /**
   * Pagamento findFirstOrThrow
   */
  export type PagamentoFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Pagamento
     */
    select?: PagamentoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Pagamento
     */
    omit?: PagamentoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PagamentoInclude<ExtArgs> | null
    /**
     * Filter, which Pagamento to fetch.
     */
    where?: PagamentoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Pagamentos to fetch.
     */
    orderBy?: PagamentoOrderByWithRelationInput | PagamentoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Pagamentos.
     */
    cursor?: PagamentoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Pagamentos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Pagamentos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Pagamentos.
     */
    distinct?: PagamentoScalarFieldEnum | PagamentoScalarFieldEnum[]
  }

  /**
   * Pagamento findMany
   */
  export type PagamentoFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Pagamento
     */
    select?: PagamentoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Pagamento
     */
    omit?: PagamentoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PagamentoInclude<ExtArgs> | null
    /**
     * Filter, which Pagamentos to fetch.
     */
    where?: PagamentoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Pagamentos to fetch.
     */
    orderBy?: PagamentoOrderByWithRelationInput | PagamentoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Pagamentos.
     */
    cursor?: PagamentoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Pagamentos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Pagamentos.
     */
    skip?: number
    distinct?: PagamentoScalarFieldEnum | PagamentoScalarFieldEnum[]
  }

  /**
   * Pagamento create
   */
  export type PagamentoCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Pagamento
     */
    select?: PagamentoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Pagamento
     */
    omit?: PagamentoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PagamentoInclude<ExtArgs> | null
    /**
     * The data needed to create a Pagamento.
     */
    data: XOR<PagamentoCreateInput, PagamentoUncheckedCreateInput>
  }

  /**
   * Pagamento createMany
   */
  export type PagamentoCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Pagamentos.
     */
    data: PagamentoCreateManyInput | PagamentoCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Pagamento createManyAndReturn
   */
  export type PagamentoCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Pagamento
     */
    select?: PagamentoSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Pagamento
     */
    omit?: PagamentoOmit<ExtArgs> | null
    /**
     * The data used to create many Pagamentos.
     */
    data: PagamentoCreateManyInput | PagamentoCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PagamentoIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Pagamento update
   */
  export type PagamentoUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Pagamento
     */
    select?: PagamentoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Pagamento
     */
    omit?: PagamentoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PagamentoInclude<ExtArgs> | null
    /**
     * The data needed to update a Pagamento.
     */
    data: XOR<PagamentoUpdateInput, PagamentoUncheckedUpdateInput>
    /**
     * Choose, which Pagamento to update.
     */
    where: PagamentoWhereUniqueInput
  }

  /**
   * Pagamento updateMany
   */
  export type PagamentoUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Pagamentos.
     */
    data: XOR<PagamentoUpdateManyMutationInput, PagamentoUncheckedUpdateManyInput>
    /**
     * Filter which Pagamentos to update
     */
    where?: PagamentoWhereInput
    /**
     * Limit how many Pagamentos to update.
     */
    limit?: number
  }

  /**
   * Pagamento updateManyAndReturn
   */
  export type PagamentoUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Pagamento
     */
    select?: PagamentoSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Pagamento
     */
    omit?: PagamentoOmit<ExtArgs> | null
    /**
     * The data used to update Pagamentos.
     */
    data: XOR<PagamentoUpdateManyMutationInput, PagamentoUncheckedUpdateManyInput>
    /**
     * Filter which Pagamentos to update
     */
    where?: PagamentoWhereInput
    /**
     * Limit how many Pagamentos to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PagamentoIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Pagamento upsert
   */
  export type PagamentoUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Pagamento
     */
    select?: PagamentoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Pagamento
     */
    omit?: PagamentoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PagamentoInclude<ExtArgs> | null
    /**
     * The filter to search for the Pagamento to update in case it exists.
     */
    where: PagamentoWhereUniqueInput
    /**
     * In case the Pagamento found by the `where` argument doesn't exist, create a new Pagamento with this data.
     */
    create: XOR<PagamentoCreateInput, PagamentoUncheckedCreateInput>
    /**
     * In case the Pagamento was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PagamentoUpdateInput, PagamentoUncheckedUpdateInput>
  }

  /**
   * Pagamento delete
   */
  export type PagamentoDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Pagamento
     */
    select?: PagamentoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Pagamento
     */
    omit?: PagamentoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PagamentoInclude<ExtArgs> | null
    /**
     * Filter which Pagamento to delete.
     */
    where: PagamentoWhereUniqueInput
  }

  /**
   * Pagamento deleteMany
   */
  export type PagamentoDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Pagamentos to delete
     */
    where?: PagamentoWhereInput
    /**
     * Limit how many Pagamentos to delete.
     */
    limit?: number
  }

  /**
   * Pagamento without action
   */
  export type PagamentoDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Pagamento
     */
    select?: PagamentoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Pagamento
     */
    omit?: PagamentoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PagamentoInclude<ExtArgs> | null
  }


  /**
   * Model Inventario
   */

  export type AggregateInventario = {
    _count: InventarioCountAggregateOutputType | null
    _avg: InventarioAvgAggregateOutputType | null
    _sum: InventarioSumAggregateOutputType | null
    _min: InventarioMinAggregateOutputType | null
    _max: InventarioMaxAggregateOutputType | null
  }

  export type InventarioAvgAggregateOutputType = {
    quantidade: number | null
    preco: number | null
  }

  export type InventarioSumAggregateOutputType = {
    quantidade: number | null
    preco: number | null
  }

  export type InventarioMinAggregateOutputType = {
    id: string | null
    nome: string | null
    quantidade: number | null
    preco: number | null
    userId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type InventarioMaxAggregateOutputType = {
    id: string | null
    nome: string | null
    quantidade: number | null
    preco: number | null
    userId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type InventarioCountAggregateOutputType = {
    id: number
    nome: number
    quantidade: number
    preco: number
    userId: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type InventarioAvgAggregateInputType = {
    quantidade?: true
    preco?: true
  }

  export type InventarioSumAggregateInputType = {
    quantidade?: true
    preco?: true
  }

  export type InventarioMinAggregateInputType = {
    id?: true
    nome?: true
    quantidade?: true
    preco?: true
    userId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type InventarioMaxAggregateInputType = {
    id?: true
    nome?: true
    quantidade?: true
    preco?: true
    userId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type InventarioCountAggregateInputType = {
    id?: true
    nome?: true
    quantidade?: true
    preco?: true
    userId?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type InventarioAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Inventario to aggregate.
     */
    where?: InventarioWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Inventarios to fetch.
     */
    orderBy?: InventarioOrderByWithRelationInput | InventarioOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: InventarioWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Inventarios from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Inventarios.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Inventarios
    **/
    _count?: true | InventarioCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: InventarioAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: InventarioSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: InventarioMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: InventarioMaxAggregateInputType
  }

  export type GetInventarioAggregateType<T extends InventarioAggregateArgs> = {
        [P in keyof T & keyof AggregateInventario]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateInventario[P]>
      : GetScalarType<T[P], AggregateInventario[P]>
  }




  export type InventarioGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: InventarioWhereInput
    orderBy?: InventarioOrderByWithAggregationInput | InventarioOrderByWithAggregationInput[]
    by: InventarioScalarFieldEnum[] | InventarioScalarFieldEnum
    having?: InventarioScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: InventarioCountAggregateInputType | true
    _avg?: InventarioAvgAggregateInputType
    _sum?: InventarioSumAggregateInputType
    _min?: InventarioMinAggregateInputType
    _max?: InventarioMaxAggregateInputType
  }

  export type InventarioGroupByOutputType = {
    id: string
    nome: string
    quantidade: number
    preco: number
    userId: string
    createdAt: Date
    updatedAt: Date
    _count: InventarioCountAggregateOutputType | null
    _avg: InventarioAvgAggregateOutputType | null
    _sum: InventarioSumAggregateOutputType | null
    _min: InventarioMinAggregateOutputType | null
    _max: InventarioMaxAggregateOutputType | null
  }

  type GetInventarioGroupByPayload<T extends InventarioGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<InventarioGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof InventarioGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], InventarioGroupByOutputType[P]>
            : GetScalarType<T[P], InventarioGroupByOutputType[P]>
        }
      >
    >


  export type InventarioSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    nome?: boolean
    quantidade?: boolean
    preco?: boolean
    userId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["inventario"]>

  export type InventarioSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    nome?: boolean
    quantidade?: boolean
    preco?: boolean
    userId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["inventario"]>

  export type InventarioSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    nome?: boolean
    quantidade?: boolean
    preco?: boolean
    userId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["inventario"]>

  export type InventarioSelectScalar = {
    id?: boolean
    nome?: boolean
    quantidade?: boolean
    preco?: boolean
    userId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type InventarioOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "nome" | "quantidade" | "preco" | "userId" | "createdAt" | "updatedAt", ExtArgs["result"]["inventario"]>
  export type InventarioInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type InventarioIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type InventarioIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $InventarioPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Inventario"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      nome: string
      quantidade: number
      preco: number
      userId: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["inventario"]>
    composites: {}
  }

  type InventarioGetPayload<S extends boolean | null | undefined | InventarioDefaultArgs> = $Result.GetResult<Prisma.$InventarioPayload, S>

  type InventarioCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<InventarioFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: InventarioCountAggregateInputType | true
    }

  export interface InventarioDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Inventario'], meta: { name: 'Inventario' } }
    /**
     * Find zero or one Inventario that matches the filter.
     * @param {InventarioFindUniqueArgs} args - Arguments to find a Inventario
     * @example
     * // Get one Inventario
     * const inventario = await prisma.inventario.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends InventarioFindUniqueArgs>(args: SelectSubset<T, InventarioFindUniqueArgs<ExtArgs>>): Prisma__InventarioClient<$Result.GetResult<Prisma.$InventarioPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Inventario that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {InventarioFindUniqueOrThrowArgs} args - Arguments to find a Inventario
     * @example
     * // Get one Inventario
     * const inventario = await prisma.inventario.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends InventarioFindUniqueOrThrowArgs>(args: SelectSubset<T, InventarioFindUniqueOrThrowArgs<ExtArgs>>): Prisma__InventarioClient<$Result.GetResult<Prisma.$InventarioPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Inventario that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InventarioFindFirstArgs} args - Arguments to find a Inventario
     * @example
     * // Get one Inventario
     * const inventario = await prisma.inventario.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends InventarioFindFirstArgs>(args?: SelectSubset<T, InventarioFindFirstArgs<ExtArgs>>): Prisma__InventarioClient<$Result.GetResult<Prisma.$InventarioPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Inventario that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InventarioFindFirstOrThrowArgs} args - Arguments to find a Inventario
     * @example
     * // Get one Inventario
     * const inventario = await prisma.inventario.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends InventarioFindFirstOrThrowArgs>(args?: SelectSubset<T, InventarioFindFirstOrThrowArgs<ExtArgs>>): Prisma__InventarioClient<$Result.GetResult<Prisma.$InventarioPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Inventarios that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InventarioFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Inventarios
     * const inventarios = await prisma.inventario.findMany()
     * 
     * // Get first 10 Inventarios
     * const inventarios = await prisma.inventario.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const inventarioWithIdOnly = await prisma.inventario.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends InventarioFindManyArgs>(args?: SelectSubset<T, InventarioFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InventarioPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Inventario.
     * @param {InventarioCreateArgs} args - Arguments to create a Inventario.
     * @example
     * // Create one Inventario
     * const Inventario = await prisma.inventario.create({
     *   data: {
     *     // ... data to create a Inventario
     *   }
     * })
     * 
     */
    create<T extends InventarioCreateArgs>(args: SelectSubset<T, InventarioCreateArgs<ExtArgs>>): Prisma__InventarioClient<$Result.GetResult<Prisma.$InventarioPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Inventarios.
     * @param {InventarioCreateManyArgs} args - Arguments to create many Inventarios.
     * @example
     * // Create many Inventarios
     * const inventario = await prisma.inventario.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends InventarioCreateManyArgs>(args?: SelectSubset<T, InventarioCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Inventarios and returns the data saved in the database.
     * @param {InventarioCreateManyAndReturnArgs} args - Arguments to create many Inventarios.
     * @example
     * // Create many Inventarios
     * const inventario = await prisma.inventario.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Inventarios and only return the `id`
     * const inventarioWithIdOnly = await prisma.inventario.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends InventarioCreateManyAndReturnArgs>(args?: SelectSubset<T, InventarioCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InventarioPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Inventario.
     * @param {InventarioDeleteArgs} args - Arguments to delete one Inventario.
     * @example
     * // Delete one Inventario
     * const Inventario = await prisma.inventario.delete({
     *   where: {
     *     // ... filter to delete one Inventario
     *   }
     * })
     * 
     */
    delete<T extends InventarioDeleteArgs>(args: SelectSubset<T, InventarioDeleteArgs<ExtArgs>>): Prisma__InventarioClient<$Result.GetResult<Prisma.$InventarioPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Inventario.
     * @param {InventarioUpdateArgs} args - Arguments to update one Inventario.
     * @example
     * // Update one Inventario
     * const inventario = await prisma.inventario.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends InventarioUpdateArgs>(args: SelectSubset<T, InventarioUpdateArgs<ExtArgs>>): Prisma__InventarioClient<$Result.GetResult<Prisma.$InventarioPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Inventarios.
     * @param {InventarioDeleteManyArgs} args - Arguments to filter Inventarios to delete.
     * @example
     * // Delete a few Inventarios
     * const { count } = await prisma.inventario.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends InventarioDeleteManyArgs>(args?: SelectSubset<T, InventarioDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Inventarios.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InventarioUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Inventarios
     * const inventario = await prisma.inventario.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends InventarioUpdateManyArgs>(args: SelectSubset<T, InventarioUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Inventarios and returns the data updated in the database.
     * @param {InventarioUpdateManyAndReturnArgs} args - Arguments to update many Inventarios.
     * @example
     * // Update many Inventarios
     * const inventario = await prisma.inventario.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Inventarios and only return the `id`
     * const inventarioWithIdOnly = await prisma.inventario.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends InventarioUpdateManyAndReturnArgs>(args: SelectSubset<T, InventarioUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InventarioPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Inventario.
     * @param {InventarioUpsertArgs} args - Arguments to update or create a Inventario.
     * @example
     * // Update or create a Inventario
     * const inventario = await prisma.inventario.upsert({
     *   create: {
     *     // ... data to create a Inventario
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Inventario we want to update
     *   }
     * })
     */
    upsert<T extends InventarioUpsertArgs>(args: SelectSubset<T, InventarioUpsertArgs<ExtArgs>>): Prisma__InventarioClient<$Result.GetResult<Prisma.$InventarioPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Inventarios.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InventarioCountArgs} args - Arguments to filter Inventarios to count.
     * @example
     * // Count the number of Inventarios
     * const count = await prisma.inventario.count({
     *   where: {
     *     // ... the filter for the Inventarios we want to count
     *   }
     * })
    **/
    count<T extends InventarioCountArgs>(
      args?: Subset<T, InventarioCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], InventarioCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Inventario.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InventarioAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends InventarioAggregateArgs>(args: Subset<T, InventarioAggregateArgs>): Prisma.PrismaPromise<GetInventarioAggregateType<T>>

    /**
     * Group by Inventario.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InventarioGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends InventarioGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: InventarioGroupByArgs['orderBy'] }
        : { orderBy?: InventarioGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, InventarioGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetInventarioGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Inventario model
   */
  readonly fields: InventarioFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Inventario.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__InventarioClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Inventario model
   */
  interface InventarioFieldRefs {
    readonly id: FieldRef<"Inventario", 'String'>
    readonly nome: FieldRef<"Inventario", 'String'>
    readonly quantidade: FieldRef<"Inventario", 'Int'>
    readonly preco: FieldRef<"Inventario", 'Float'>
    readonly userId: FieldRef<"Inventario", 'String'>
    readonly createdAt: FieldRef<"Inventario", 'DateTime'>
    readonly updatedAt: FieldRef<"Inventario", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Inventario findUnique
   */
  export type InventarioFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Inventario
     */
    select?: InventarioSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Inventario
     */
    omit?: InventarioOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InventarioInclude<ExtArgs> | null
    /**
     * Filter, which Inventario to fetch.
     */
    where: InventarioWhereUniqueInput
  }

  /**
   * Inventario findUniqueOrThrow
   */
  export type InventarioFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Inventario
     */
    select?: InventarioSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Inventario
     */
    omit?: InventarioOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InventarioInclude<ExtArgs> | null
    /**
     * Filter, which Inventario to fetch.
     */
    where: InventarioWhereUniqueInput
  }

  /**
   * Inventario findFirst
   */
  export type InventarioFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Inventario
     */
    select?: InventarioSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Inventario
     */
    omit?: InventarioOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InventarioInclude<ExtArgs> | null
    /**
     * Filter, which Inventario to fetch.
     */
    where?: InventarioWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Inventarios to fetch.
     */
    orderBy?: InventarioOrderByWithRelationInput | InventarioOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Inventarios.
     */
    cursor?: InventarioWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Inventarios from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Inventarios.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Inventarios.
     */
    distinct?: InventarioScalarFieldEnum | InventarioScalarFieldEnum[]
  }

  /**
   * Inventario findFirstOrThrow
   */
  export type InventarioFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Inventario
     */
    select?: InventarioSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Inventario
     */
    omit?: InventarioOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InventarioInclude<ExtArgs> | null
    /**
     * Filter, which Inventario to fetch.
     */
    where?: InventarioWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Inventarios to fetch.
     */
    orderBy?: InventarioOrderByWithRelationInput | InventarioOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Inventarios.
     */
    cursor?: InventarioWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Inventarios from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Inventarios.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Inventarios.
     */
    distinct?: InventarioScalarFieldEnum | InventarioScalarFieldEnum[]
  }

  /**
   * Inventario findMany
   */
  export type InventarioFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Inventario
     */
    select?: InventarioSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Inventario
     */
    omit?: InventarioOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InventarioInclude<ExtArgs> | null
    /**
     * Filter, which Inventarios to fetch.
     */
    where?: InventarioWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Inventarios to fetch.
     */
    orderBy?: InventarioOrderByWithRelationInput | InventarioOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Inventarios.
     */
    cursor?: InventarioWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Inventarios from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Inventarios.
     */
    skip?: number
    distinct?: InventarioScalarFieldEnum | InventarioScalarFieldEnum[]
  }

  /**
   * Inventario create
   */
  export type InventarioCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Inventario
     */
    select?: InventarioSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Inventario
     */
    omit?: InventarioOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InventarioInclude<ExtArgs> | null
    /**
     * The data needed to create a Inventario.
     */
    data: XOR<InventarioCreateInput, InventarioUncheckedCreateInput>
  }

  /**
   * Inventario createMany
   */
  export type InventarioCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Inventarios.
     */
    data: InventarioCreateManyInput | InventarioCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Inventario createManyAndReturn
   */
  export type InventarioCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Inventario
     */
    select?: InventarioSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Inventario
     */
    omit?: InventarioOmit<ExtArgs> | null
    /**
     * The data used to create many Inventarios.
     */
    data: InventarioCreateManyInput | InventarioCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InventarioIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Inventario update
   */
  export type InventarioUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Inventario
     */
    select?: InventarioSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Inventario
     */
    omit?: InventarioOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InventarioInclude<ExtArgs> | null
    /**
     * The data needed to update a Inventario.
     */
    data: XOR<InventarioUpdateInput, InventarioUncheckedUpdateInput>
    /**
     * Choose, which Inventario to update.
     */
    where: InventarioWhereUniqueInput
  }

  /**
   * Inventario updateMany
   */
  export type InventarioUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Inventarios.
     */
    data: XOR<InventarioUpdateManyMutationInput, InventarioUncheckedUpdateManyInput>
    /**
     * Filter which Inventarios to update
     */
    where?: InventarioWhereInput
    /**
     * Limit how many Inventarios to update.
     */
    limit?: number
  }

  /**
   * Inventario updateManyAndReturn
   */
  export type InventarioUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Inventario
     */
    select?: InventarioSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Inventario
     */
    omit?: InventarioOmit<ExtArgs> | null
    /**
     * The data used to update Inventarios.
     */
    data: XOR<InventarioUpdateManyMutationInput, InventarioUncheckedUpdateManyInput>
    /**
     * Filter which Inventarios to update
     */
    where?: InventarioWhereInput
    /**
     * Limit how many Inventarios to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InventarioIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Inventario upsert
   */
  export type InventarioUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Inventario
     */
    select?: InventarioSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Inventario
     */
    omit?: InventarioOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InventarioInclude<ExtArgs> | null
    /**
     * The filter to search for the Inventario to update in case it exists.
     */
    where: InventarioWhereUniqueInput
    /**
     * In case the Inventario found by the `where` argument doesn't exist, create a new Inventario with this data.
     */
    create: XOR<InventarioCreateInput, InventarioUncheckedCreateInput>
    /**
     * In case the Inventario was found with the provided `where` argument, update it with this data.
     */
    update: XOR<InventarioUpdateInput, InventarioUncheckedUpdateInput>
  }

  /**
   * Inventario delete
   */
  export type InventarioDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Inventario
     */
    select?: InventarioSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Inventario
     */
    omit?: InventarioOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InventarioInclude<ExtArgs> | null
    /**
     * Filter which Inventario to delete.
     */
    where: InventarioWhereUniqueInput
  }

  /**
   * Inventario deleteMany
   */
  export type InventarioDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Inventarios to delete
     */
    where?: InventarioWhereInput
    /**
     * Limit how many Inventarios to delete.
     */
    limit?: number
  }

  /**
   * Inventario without action
   */
  export type InventarioDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Inventario
     */
    select?: InventarioSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Inventario
     */
    omit?: InventarioOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InventarioInclude<ExtArgs> | null
  }


  /**
   * Model Funcionario
   */

  export type AggregateFuncionario = {
    _count: FuncionarioCountAggregateOutputType | null
    _avg: FuncionarioAvgAggregateOutputType | null
    _sum: FuncionarioSumAggregateOutputType | null
    _min: FuncionarioMinAggregateOutputType | null
    _max: FuncionarioMaxAggregateOutputType | null
  }

  export type FuncionarioAvgAggregateOutputType = {
    salarioBruto: number | null
    horasSemana: number | null
  }

  export type FuncionarioSumAggregateOutputType = {
    salarioBruto: number | null
    horasSemana: number | null
  }

  export type FuncionarioMinAggregateOutputType = {
    id: string | null
    nome: string | null
    cargo: string | null
    tipoContrato: string | null
    dataAdmissao: Date | null
    salarioBruto: number | null
    pagamentoPorHora: boolean | null
    horasSemana: number | null
    iban: string | null
    status: string | null
    observacoes: string | null
    contratoUploadUrl: string | null
    dataCriacao: Date | null
    dataAtualizacao: Date | null
  }

  export type FuncionarioMaxAggregateOutputType = {
    id: string | null
    nome: string | null
    cargo: string | null
    tipoContrato: string | null
    dataAdmissao: Date | null
    salarioBruto: number | null
    pagamentoPorHora: boolean | null
    horasSemana: number | null
    iban: string | null
    status: string | null
    observacoes: string | null
    contratoUploadUrl: string | null
    dataCriacao: Date | null
    dataAtualizacao: Date | null
  }

  export type FuncionarioCountAggregateOutputType = {
    id: number
    nome: number
    cargo: number
    tipoContrato: number
    dataAdmissao: number
    salarioBruto: number
    pagamentoPorHora: number
    horasSemana: number
    diasTrabalho: number
    iban: number
    status: number
    observacoes: number
    contratoUploadUrl: number
    dataCriacao: number
    dataAtualizacao: number
    _all: number
  }


  export type FuncionarioAvgAggregateInputType = {
    salarioBruto?: true
    horasSemana?: true
  }

  export type FuncionarioSumAggregateInputType = {
    salarioBruto?: true
    horasSemana?: true
  }

  export type FuncionarioMinAggregateInputType = {
    id?: true
    nome?: true
    cargo?: true
    tipoContrato?: true
    dataAdmissao?: true
    salarioBruto?: true
    pagamentoPorHora?: true
    horasSemana?: true
    iban?: true
    status?: true
    observacoes?: true
    contratoUploadUrl?: true
    dataCriacao?: true
    dataAtualizacao?: true
  }

  export type FuncionarioMaxAggregateInputType = {
    id?: true
    nome?: true
    cargo?: true
    tipoContrato?: true
    dataAdmissao?: true
    salarioBruto?: true
    pagamentoPorHora?: true
    horasSemana?: true
    iban?: true
    status?: true
    observacoes?: true
    contratoUploadUrl?: true
    dataCriacao?: true
    dataAtualizacao?: true
  }

  export type FuncionarioCountAggregateInputType = {
    id?: true
    nome?: true
    cargo?: true
    tipoContrato?: true
    dataAdmissao?: true
    salarioBruto?: true
    pagamentoPorHora?: true
    horasSemana?: true
    diasTrabalho?: true
    iban?: true
    status?: true
    observacoes?: true
    contratoUploadUrl?: true
    dataCriacao?: true
    dataAtualizacao?: true
    _all?: true
  }

  export type FuncionarioAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Funcionario to aggregate.
     */
    where?: FuncionarioWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Funcionarios to fetch.
     */
    orderBy?: FuncionarioOrderByWithRelationInput | FuncionarioOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: FuncionarioWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Funcionarios from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Funcionarios.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Funcionarios
    **/
    _count?: true | FuncionarioCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: FuncionarioAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: FuncionarioSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: FuncionarioMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: FuncionarioMaxAggregateInputType
  }

  export type GetFuncionarioAggregateType<T extends FuncionarioAggregateArgs> = {
        [P in keyof T & keyof AggregateFuncionario]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateFuncionario[P]>
      : GetScalarType<T[P], AggregateFuncionario[P]>
  }




  export type FuncionarioGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: FuncionarioWhereInput
    orderBy?: FuncionarioOrderByWithAggregationInput | FuncionarioOrderByWithAggregationInput[]
    by: FuncionarioScalarFieldEnum[] | FuncionarioScalarFieldEnum
    having?: FuncionarioScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: FuncionarioCountAggregateInputType | true
    _avg?: FuncionarioAvgAggregateInputType
    _sum?: FuncionarioSumAggregateInputType
    _min?: FuncionarioMinAggregateInputType
    _max?: FuncionarioMaxAggregateInputType
  }

  export type FuncionarioGroupByOutputType = {
    id: string
    nome: string
    cargo: string
    tipoContrato: string
    dataAdmissao: Date
    salarioBruto: number
    pagamentoPorHora: boolean
    horasSemana: number
    diasTrabalho: string[]
    iban: string | null
    status: string
    observacoes: string | null
    contratoUploadUrl: string | null
    dataCriacao: Date
    dataAtualizacao: Date
    _count: FuncionarioCountAggregateOutputType | null
    _avg: FuncionarioAvgAggregateOutputType | null
    _sum: FuncionarioSumAggregateOutputType | null
    _min: FuncionarioMinAggregateOutputType | null
    _max: FuncionarioMaxAggregateOutputType | null
  }

  type GetFuncionarioGroupByPayload<T extends FuncionarioGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<FuncionarioGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof FuncionarioGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], FuncionarioGroupByOutputType[P]>
            : GetScalarType<T[P], FuncionarioGroupByOutputType[P]>
        }
      >
    >


  export type FuncionarioSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    nome?: boolean
    cargo?: boolean
    tipoContrato?: boolean
    dataAdmissao?: boolean
    salarioBruto?: boolean
    pagamentoPorHora?: boolean
    horasSemana?: boolean
    diasTrabalho?: boolean
    iban?: boolean
    status?: boolean
    observacoes?: boolean
    contratoUploadUrl?: boolean
    dataCriacao?: boolean
    dataAtualizacao?: boolean
    controleJornada?: boolean | Funcionario$controleJornadaArgs<ExtArgs>
    resumoPagamento?: boolean | Funcionario$resumoPagamentoArgs<ExtArgs>
    _count?: boolean | FuncionarioCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["funcionario"]>

  export type FuncionarioSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    nome?: boolean
    cargo?: boolean
    tipoContrato?: boolean
    dataAdmissao?: boolean
    salarioBruto?: boolean
    pagamentoPorHora?: boolean
    horasSemana?: boolean
    diasTrabalho?: boolean
    iban?: boolean
    status?: boolean
    observacoes?: boolean
    contratoUploadUrl?: boolean
    dataCriacao?: boolean
    dataAtualizacao?: boolean
  }, ExtArgs["result"]["funcionario"]>

  export type FuncionarioSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    nome?: boolean
    cargo?: boolean
    tipoContrato?: boolean
    dataAdmissao?: boolean
    salarioBruto?: boolean
    pagamentoPorHora?: boolean
    horasSemana?: boolean
    diasTrabalho?: boolean
    iban?: boolean
    status?: boolean
    observacoes?: boolean
    contratoUploadUrl?: boolean
    dataCriacao?: boolean
    dataAtualizacao?: boolean
  }, ExtArgs["result"]["funcionario"]>

  export type FuncionarioSelectScalar = {
    id?: boolean
    nome?: boolean
    cargo?: boolean
    tipoContrato?: boolean
    dataAdmissao?: boolean
    salarioBruto?: boolean
    pagamentoPorHora?: boolean
    horasSemana?: boolean
    diasTrabalho?: boolean
    iban?: boolean
    status?: boolean
    observacoes?: boolean
    contratoUploadUrl?: boolean
    dataCriacao?: boolean
    dataAtualizacao?: boolean
  }

  export type FuncionarioOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "nome" | "cargo" | "tipoContrato" | "dataAdmissao" | "salarioBruto" | "pagamentoPorHora" | "horasSemana" | "diasTrabalho" | "iban" | "status" | "observacoes" | "contratoUploadUrl" | "dataCriacao" | "dataAtualizacao", ExtArgs["result"]["funcionario"]>
  export type FuncionarioInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    controleJornada?: boolean | Funcionario$controleJornadaArgs<ExtArgs>
    resumoPagamento?: boolean | Funcionario$resumoPagamentoArgs<ExtArgs>
    _count?: boolean | FuncionarioCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type FuncionarioIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type FuncionarioIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $FuncionarioPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Funcionario"
    objects: {
      controleJornada: Prisma.$ControleJornadaPayload<ExtArgs>[]
      resumoPagamento: Prisma.$ResumoPagamentoPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      nome: string
      cargo: string
      tipoContrato: string
      dataAdmissao: Date
      salarioBruto: number
      pagamentoPorHora: boolean
      horasSemana: number
      diasTrabalho: string[]
      iban: string | null
      status: string
      observacoes: string | null
      contratoUploadUrl: string | null
      dataCriacao: Date
      dataAtualizacao: Date
    }, ExtArgs["result"]["funcionario"]>
    composites: {}
  }

  type FuncionarioGetPayload<S extends boolean | null | undefined | FuncionarioDefaultArgs> = $Result.GetResult<Prisma.$FuncionarioPayload, S>

  type FuncionarioCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<FuncionarioFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: FuncionarioCountAggregateInputType | true
    }

  export interface FuncionarioDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Funcionario'], meta: { name: 'Funcionario' } }
    /**
     * Find zero or one Funcionario that matches the filter.
     * @param {FuncionarioFindUniqueArgs} args - Arguments to find a Funcionario
     * @example
     * // Get one Funcionario
     * const funcionario = await prisma.funcionario.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends FuncionarioFindUniqueArgs>(args: SelectSubset<T, FuncionarioFindUniqueArgs<ExtArgs>>): Prisma__FuncionarioClient<$Result.GetResult<Prisma.$FuncionarioPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Funcionario that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {FuncionarioFindUniqueOrThrowArgs} args - Arguments to find a Funcionario
     * @example
     * // Get one Funcionario
     * const funcionario = await prisma.funcionario.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends FuncionarioFindUniqueOrThrowArgs>(args: SelectSubset<T, FuncionarioFindUniqueOrThrowArgs<ExtArgs>>): Prisma__FuncionarioClient<$Result.GetResult<Prisma.$FuncionarioPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Funcionario that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FuncionarioFindFirstArgs} args - Arguments to find a Funcionario
     * @example
     * // Get one Funcionario
     * const funcionario = await prisma.funcionario.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends FuncionarioFindFirstArgs>(args?: SelectSubset<T, FuncionarioFindFirstArgs<ExtArgs>>): Prisma__FuncionarioClient<$Result.GetResult<Prisma.$FuncionarioPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Funcionario that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FuncionarioFindFirstOrThrowArgs} args - Arguments to find a Funcionario
     * @example
     * // Get one Funcionario
     * const funcionario = await prisma.funcionario.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends FuncionarioFindFirstOrThrowArgs>(args?: SelectSubset<T, FuncionarioFindFirstOrThrowArgs<ExtArgs>>): Prisma__FuncionarioClient<$Result.GetResult<Prisma.$FuncionarioPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Funcionarios that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FuncionarioFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Funcionarios
     * const funcionarios = await prisma.funcionario.findMany()
     * 
     * // Get first 10 Funcionarios
     * const funcionarios = await prisma.funcionario.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const funcionarioWithIdOnly = await prisma.funcionario.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends FuncionarioFindManyArgs>(args?: SelectSubset<T, FuncionarioFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FuncionarioPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Funcionario.
     * @param {FuncionarioCreateArgs} args - Arguments to create a Funcionario.
     * @example
     * // Create one Funcionario
     * const Funcionario = await prisma.funcionario.create({
     *   data: {
     *     // ... data to create a Funcionario
     *   }
     * })
     * 
     */
    create<T extends FuncionarioCreateArgs>(args: SelectSubset<T, FuncionarioCreateArgs<ExtArgs>>): Prisma__FuncionarioClient<$Result.GetResult<Prisma.$FuncionarioPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Funcionarios.
     * @param {FuncionarioCreateManyArgs} args - Arguments to create many Funcionarios.
     * @example
     * // Create many Funcionarios
     * const funcionario = await prisma.funcionario.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends FuncionarioCreateManyArgs>(args?: SelectSubset<T, FuncionarioCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Funcionarios and returns the data saved in the database.
     * @param {FuncionarioCreateManyAndReturnArgs} args - Arguments to create many Funcionarios.
     * @example
     * // Create many Funcionarios
     * const funcionario = await prisma.funcionario.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Funcionarios and only return the `id`
     * const funcionarioWithIdOnly = await prisma.funcionario.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends FuncionarioCreateManyAndReturnArgs>(args?: SelectSubset<T, FuncionarioCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FuncionarioPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Funcionario.
     * @param {FuncionarioDeleteArgs} args - Arguments to delete one Funcionario.
     * @example
     * // Delete one Funcionario
     * const Funcionario = await prisma.funcionario.delete({
     *   where: {
     *     // ... filter to delete one Funcionario
     *   }
     * })
     * 
     */
    delete<T extends FuncionarioDeleteArgs>(args: SelectSubset<T, FuncionarioDeleteArgs<ExtArgs>>): Prisma__FuncionarioClient<$Result.GetResult<Prisma.$FuncionarioPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Funcionario.
     * @param {FuncionarioUpdateArgs} args - Arguments to update one Funcionario.
     * @example
     * // Update one Funcionario
     * const funcionario = await prisma.funcionario.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends FuncionarioUpdateArgs>(args: SelectSubset<T, FuncionarioUpdateArgs<ExtArgs>>): Prisma__FuncionarioClient<$Result.GetResult<Prisma.$FuncionarioPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Funcionarios.
     * @param {FuncionarioDeleteManyArgs} args - Arguments to filter Funcionarios to delete.
     * @example
     * // Delete a few Funcionarios
     * const { count } = await prisma.funcionario.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends FuncionarioDeleteManyArgs>(args?: SelectSubset<T, FuncionarioDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Funcionarios.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FuncionarioUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Funcionarios
     * const funcionario = await prisma.funcionario.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends FuncionarioUpdateManyArgs>(args: SelectSubset<T, FuncionarioUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Funcionarios and returns the data updated in the database.
     * @param {FuncionarioUpdateManyAndReturnArgs} args - Arguments to update many Funcionarios.
     * @example
     * // Update many Funcionarios
     * const funcionario = await prisma.funcionario.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Funcionarios and only return the `id`
     * const funcionarioWithIdOnly = await prisma.funcionario.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends FuncionarioUpdateManyAndReturnArgs>(args: SelectSubset<T, FuncionarioUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FuncionarioPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Funcionario.
     * @param {FuncionarioUpsertArgs} args - Arguments to update or create a Funcionario.
     * @example
     * // Update or create a Funcionario
     * const funcionario = await prisma.funcionario.upsert({
     *   create: {
     *     // ... data to create a Funcionario
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Funcionario we want to update
     *   }
     * })
     */
    upsert<T extends FuncionarioUpsertArgs>(args: SelectSubset<T, FuncionarioUpsertArgs<ExtArgs>>): Prisma__FuncionarioClient<$Result.GetResult<Prisma.$FuncionarioPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Funcionarios.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FuncionarioCountArgs} args - Arguments to filter Funcionarios to count.
     * @example
     * // Count the number of Funcionarios
     * const count = await prisma.funcionario.count({
     *   where: {
     *     // ... the filter for the Funcionarios we want to count
     *   }
     * })
    **/
    count<T extends FuncionarioCountArgs>(
      args?: Subset<T, FuncionarioCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], FuncionarioCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Funcionario.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FuncionarioAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends FuncionarioAggregateArgs>(args: Subset<T, FuncionarioAggregateArgs>): Prisma.PrismaPromise<GetFuncionarioAggregateType<T>>

    /**
     * Group by Funcionario.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FuncionarioGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends FuncionarioGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: FuncionarioGroupByArgs['orderBy'] }
        : { orderBy?: FuncionarioGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, FuncionarioGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetFuncionarioGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Funcionario model
   */
  readonly fields: FuncionarioFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Funcionario.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__FuncionarioClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    controleJornada<T extends Funcionario$controleJornadaArgs<ExtArgs> = {}>(args?: Subset<T, Funcionario$controleJornadaArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ControleJornadaPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    resumoPagamento<T extends Funcionario$resumoPagamentoArgs<ExtArgs> = {}>(args?: Subset<T, Funcionario$resumoPagamentoArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ResumoPagamentoPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Funcionario model
   */
  interface FuncionarioFieldRefs {
    readonly id: FieldRef<"Funcionario", 'String'>
    readonly nome: FieldRef<"Funcionario", 'String'>
    readonly cargo: FieldRef<"Funcionario", 'String'>
    readonly tipoContrato: FieldRef<"Funcionario", 'String'>
    readonly dataAdmissao: FieldRef<"Funcionario", 'DateTime'>
    readonly salarioBruto: FieldRef<"Funcionario", 'Float'>
    readonly pagamentoPorHora: FieldRef<"Funcionario", 'Boolean'>
    readonly horasSemana: FieldRef<"Funcionario", 'Float'>
    readonly diasTrabalho: FieldRef<"Funcionario", 'String[]'>
    readonly iban: FieldRef<"Funcionario", 'String'>
    readonly status: FieldRef<"Funcionario", 'String'>
    readonly observacoes: FieldRef<"Funcionario", 'String'>
    readonly contratoUploadUrl: FieldRef<"Funcionario", 'String'>
    readonly dataCriacao: FieldRef<"Funcionario", 'DateTime'>
    readonly dataAtualizacao: FieldRef<"Funcionario", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Funcionario findUnique
   */
  export type FuncionarioFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Funcionario
     */
    select?: FuncionarioSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Funcionario
     */
    omit?: FuncionarioOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FuncionarioInclude<ExtArgs> | null
    /**
     * Filter, which Funcionario to fetch.
     */
    where: FuncionarioWhereUniqueInput
  }

  /**
   * Funcionario findUniqueOrThrow
   */
  export type FuncionarioFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Funcionario
     */
    select?: FuncionarioSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Funcionario
     */
    omit?: FuncionarioOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FuncionarioInclude<ExtArgs> | null
    /**
     * Filter, which Funcionario to fetch.
     */
    where: FuncionarioWhereUniqueInput
  }

  /**
   * Funcionario findFirst
   */
  export type FuncionarioFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Funcionario
     */
    select?: FuncionarioSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Funcionario
     */
    omit?: FuncionarioOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FuncionarioInclude<ExtArgs> | null
    /**
     * Filter, which Funcionario to fetch.
     */
    where?: FuncionarioWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Funcionarios to fetch.
     */
    orderBy?: FuncionarioOrderByWithRelationInput | FuncionarioOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Funcionarios.
     */
    cursor?: FuncionarioWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Funcionarios from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Funcionarios.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Funcionarios.
     */
    distinct?: FuncionarioScalarFieldEnum | FuncionarioScalarFieldEnum[]
  }

  /**
   * Funcionario findFirstOrThrow
   */
  export type FuncionarioFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Funcionario
     */
    select?: FuncionarioSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Funcionario
     */
    omit?: FuncionarioOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FuncionarioInclude<ExtArgs> | null
    /**
     * Filter, which Funcionario to fetch.
     */
    where?: FuncionarioWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Funcionarios to fetch.
     */
    orderBy?: FuncionarioOrderByWithRelationInput | FuncionarioOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Funcionarios.
     */
    cursor?: FuncionarioWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Funcionarios from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Funcionarios.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Funcionarios.
     */
    distinct?: FuncionarioScalarFieldEnum | FuncionarioScalarFieldEnum[]
  }

  /**
   * Funcionario findMany
   */
  export type FuncionarioFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Funcionario
     */
    select?: FuncionarioSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Funcionario
     */
    omit?: FuncionarioOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FuncionarioInclude<ExtArgs> | null
    /**
     * Filter, which Funcionarios to fetch.
     */
    where?: FuncionarioWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Funcionarios to fetch.
     */
    orderBy?: FuncionarioOrderByWithRelationInput | FuncionarioOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Funcionarios.
     */
    cursor?: FuncionarioWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Funcionarios from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Funcionarios.
     */
    skip?: number
    distinct?: FuncionarioScalarFieldEnum | FuncionarioScalarFieldEnum[]
  }

  /**
   * Funcionario create
   */
  export type FuncionarioCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Funcionario
     */
    select?: FuncionarioSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Funcionario
     */
    omit?: FuncionarioOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FuncionarioInclude<ExtArgs> | null
    /**
     * The data needed to create a Funcionario.
     */
    data: XOR<FuncionarioCreateInput, FuncionarioUncheckedCreateInput>
  }

  /**
   * Funcionario createMany
   */
  export type FuncionarioCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Funcionarios.
     */
    data: FuncionarioCreateManyInput | FuncionarioCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Funcionario createManyAndReturn
   */
  export type FuncionarioCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Funcionario
     */
    select?: FuncionarioSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Funcionario
     */
    omit?: FuncionarioOmit<ExtArgs> | null
    /**
     * The data used to create many Funcionarios.
     */
    data: FuncionarioCreateManyInput | FuncionarioCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Funcionario update
   */
  export type FuncionarioUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Funcionario
     */
    select?: FuncionarioSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Funcionario
     */
    omit?: FuncionarioOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FuncionarioInclude<ExtArgs> | null
    /**
     * The data needed to update a Funcionario.
     */
    data: XOR<FuncionarioUpdateInput, FuncionarioUncheckedUpdateInput>
    /**
     * Choose, which Funcionario to update.
     */
    where: FuncionarioWhereUniqueInput
  }

  /**
   * Funcionario updateMany
   */
  export type FuncionarioUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Funcionarios.
     */
    data: XOR<FuncionarioUpdateManyMutationInput, FuncionarioUncheckedUpdateManyInput>
    /**
     * Filter which Funcionarios to update
     */
    where?: FuncionarioWhereInput
    /**
     * Limit how many Funcionarios to update.
     */
    limit?: number
  }

  /**
   * Funcionario updateManyAndReturn
   */
  export type FuncionarioUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Funcionario
     */
    select?: FuncionarioSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Funcionario
     */
    omit?: FuncionarioOmit<ExtArgs> | null
    /**
     * The data used to update Funcionarios.
     */
    data: XOR<FuncionarioUpdateManyMutationInput, FuncionarioUncheckedUpdateManyInput>
    /**
     * Filter which Funcionarios to update
     */
    where?: FuncionarioWhereInput
    /**
     * Limit how many Funcionarios to update.
     */
    limit?: number
  }

  /**
   * Funcionario upsert
   */
  export type FuncionarioUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Funcionario
     */
    select?: FuncionarioSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Funcionario
     */
    omit?: FuncionarioOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FuncionarioInclude<ExtArgs> | null
    /**
     * The filter to search for the Funcionario to update in case it exists.
     */
    where: FuncionarioWhereUniqueInput
    /**
     * In case the Funcionario found by the `where` argument doesn't exist, create a new Funcionario with this data.
     */
    create: XOR<FuncionarioCreateInput, FuncionarioUncheckedCreateInput>
    /**
     * In case the Funcionario was found with the provided `where` argument, update it with this data.
     */
    update: XOR<FuncionarioUpdateInput, FuncionarioUncheckedUpdateInput>
  }

  /**
   * Funcionario delete
   */
  export type FuncionarioDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Funcionario
     */
    select?: FuncionarioSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Funcionario
     */
    omit?: FuncionarioOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FuncionarioInclude<ExtArgs> | null
    /**
     * Filter which Funcionario to delete.
     */
    where: FuncionarioWhereUniqueInput
  }

  /**
   * Funcionario deleteMany
   */
  export type FuncionarioDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Funcionarios to delete
     */
    where?: FuncionarioWhereInput
    /**
     * Limit how many Funcionarios to delete.
     */
    limit?: number
  }

  /**
   * Funcionario.controleJornada
   */
  export type Funcionario$controleJornadaArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ControleJornada
     */
    select?: ControleJornadaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ControleJornada
     */
    omit?: ControleJornadaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ControleJornadaInclude<ExtArgs> | null
    where?: ControleJornadaWhereInput
    orderBy?: ControleJornadaOrderByWithRelationInput | ControleJornadaOrderByWithRelationInput[]
    cursor?: ControleJornadaWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ControleJornadaScalarFieldEnum | ControleJornadaScalarFieldEnum[]
  }

  /**
   * Funcionario.resumoPagamento
   */
  export type Funcionario$resumoPagamentoArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ResumoPagamento
     */
    select?: ResumoPagamentoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ResumoPagamento
     */
    omit?: ResumoPagamentoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ResumoPagamentoInclude<ExtArgs> | null
    where?: ResumoPagamentoWhereInput
    orderBy?: ResumoPagamentoOrderByWithRelationInput | ResumoPagamentoOrderByWithRelationInput[]
    cursor?: ResumoPagamentoWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ResumoPagamentoScalarFieldEnum | ResumoPagamentoScalarFieldEnum[]
  }

  /**
   * Funcionario without action
   */
  export type FuncionarioDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Funcionario
     */
    select?: FuncionarioSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Funcionario
     */
    omit?: FuncionarioOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FuncionarioInclude<ExtArgs> | null
  }


  /**
   * Model ControleJornada
   */

  export type AggregateControleJornada = {
    _count: ControleJornadaCountAggregateOutputType | null
    _avg: ControleJornadaAvgAggregateOutputType | null
    _sum: ControleJornadaSumAggregateOutputType | null
    _min: ControleJornadaMinAggregateOutputType | null
    _max: ControleJornadaMaxAggregateOutputType | null
  }

  export type ControleJornadaAvgAggregateOutputType = {
    horasTrabalhadas: number | null
    horaExtra: number | null
  }

  export type ControleJornadaSumAggregateOutputType = {
    horasTrabalhadas: number | null
    horaExtra: number | null
  }

  export type ControleJornadaMinAggregateOutputType = {
    id: string | null
    funcionarioId: string | null
    data: Date | null
    horaEntrada: string | null
    horaSaida: string | null
    horasTrabalhadas: number | null
    horaExtra: number | null
    faltaJustificada: boolean | null
    observacoes: string | null
    dataCriacao: Date | null
    dataAtualizacao: Date | null
  }

  export type ControleJornadaMaxAggregateOutputType = {
    id: string | null
    funcionarioId: string | null
    data: Date | null
    horaEntrada: string | null
    horaSaida: string | null
    horasTrabalhadas: number | null
    horaExtra: number | null
    faltaJustificada: boolean | null
    observacoes: string | null
    dataCriacao: Date | null
    dataAtualizacao: Date | null
  }

  export type ControleJornadaCountAggregateOutputType = {
    id: number
    funcionarioId: number
    data: number
    horaEntrada: number
    horaSaida: number
    horasTrabalhadas: number
    horaExtra: number
    faltaJustificada: number
    observacoes: number
    dataCriacao: number
    dataAtualizacao: number
    _all: number
  }


  export type ControleJornadaAvgAggregateInputType = {
    horasTrabalhadas?: true
    horaExtra?: true
  }

  export type ControleJornadaSumAggregateInputType = {
    horasTrabalhadas?: true
    horaExtra?: true
  }

  export type ControleJornadaMinAggregateInputType = {
    id?: true
    funcionarioId?: true
    data?: true
    horaEntrada?: true
    horaSaida?: true
    horasTrabalhadas?: true
    horaExtra?: true
    faltaJustificada?: true
    observacoes?: true
    dataCriacao?: true
    dataAtualizacao?: true
  }

  export type ControleJornadaMaxAggregateInputType = {
    id?: true
    funcionarioId?: true
    data?: true
    horaEntrada?: true
    horaSaida?: true
    horasTrabalhadas?: true
    horaExtra?: true
    faltaJustificada?: true
    observacoes?: true
    dataCriacao?: true
    dataAtualizacao?: true
  }

  export type ControleJornadaCountAggregateInputType = {
    id?: true
    funcionarioId?: true
    data?: true
    horaEntrada?: true
    horaSaida?: true
    horasTrabalhadas?: true
    horaExtra?: true
    faltaJustificada?: true
    observacoes?: true
    dataCriacao?: true
    dataAtualizacao?: true
    _all?: true
  }

  export type ControleJornadaAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ControleJornada to aggregate.
     */
    where?: ControleJornadaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ControleJornadas to fetch.
     */
    orderBy?: ControleJornadaOrderByWithRelationInput | ControleJornadaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ControleJornadaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ControleJornadas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ControleJornadas.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ControleJornadas
    **/
    _count?: true | ControleJornadaCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ControleJornadaAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ControleJornadaSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ControleJornadaMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ControleJornadaMaxAggregateInputType
  }

  export type GetControleJornadaAggregateType<T extends ControleJornadaAggregateArgs> = {
        [P in keyof T & keyof AggregateControleJornada]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateControleJornada[P]>
      : GetScalarType<T[P], AggregateControleJornada[P]>
  }




  export type ControleJornadaGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ControleJornadaWhereInput
    orderBy?: ControleJornadaOrderByWithAggregationInput | ControleJornadaOrderByWithAggregationInput[]
    by: ControleJornadaScalarFieldEnum[] | ControleJornadaScalarFieldEnum
    having?: ControleJornadaScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ControleJornadaCountAggregateInputType | true
    _avg?: ControleJornadaAvgAggregateInputType
    _sum?: ControleJornadaSumAggregateInputType
    _min?: ControleJornadaMinAggregateInputType
    _max?: ControleJornadaMaxAggregateInputType
  }

  export type ControleJornadaGroupByOutputType = {
    id: string
    funcionarioId: string
    data: Date
    horaEntrada: string
    horaSaida: string
    horasTrabalhadas: number
    horaExtra: number | null
    faltaJustificada: boolean
    observacoes: string | null
    dataCriacao: Date
    dataAtualizacao: Date
    _count: ControleJornadaCountAggregateOutputType | null
    _avg: ControleJornadaAvgAggregateOutputType | null
    _sum: ControleJornadaSumAggregateOutputType | null
    _min: ControleJornadaMinAggregateOutputType | null
    _max: ControleJornadaMaxAggregateOutputType | null
  }

  type GetControleJornadaGroupByPayload<T extends ControleJornadaGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ControleJornadaGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ControleJornadaGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ControleJornadaGroupByOutputType[P]>
            : GetScalarType<T[P], ControleJornadaGroupByOutputType[P]>
        }
      >
    >


  export type ControleJornadaSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    funcionarioId?: boolean
    data?: boolean
    horaEntrada?: boolean
    horaSaida?: boolean
    horasTrabalhadas?: boolean
    horaExtra?: boolean
    faltaJustificada?: boolean
    observacoes?: boolean
    dataCriacao?: boolean
    dataAtualizacao?: boolean
    funcionario?: boolean | FuncionarioDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["controleJornada"]>

  export type ControleJornadaSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    funcionarioId?: boolean
    data?: boolean
    horaEntrada?: boolean
    horaSaida?: boolean
    horasTrabalhadas?: boolean
    horaExtra?: boolean
    faltaJustificada?: boolean
    observacoes?: boolean
    dataCriacao?: boolean
    dataAtualizacao?: boolean
    funcionario?: boolean | FuncionarioDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["controleJornada"]>

  export type ControleJornadaSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    funcionarioId?: boolean
    data?: boolean
    horaEntrada?: boolean
    horaSaida?: boolean
    horasTrabalhadas?: boolean
    horaExtra?: boolean
    faltaJustificada?: boolean
    observacoes?: boolean
    dataCriacao?: boolean
    dataAtualizacao?: boolean
    funcionario?: boolean | FuncionarioDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["controleJornada"]>

  export type ControleJornadaSelectScalar = {
    id?: boolean
    funcionarioId?: boolean
    data?: boolean
    horaEntrada?: boolean
    horaSaida?: boolean
    horasTrabalhadas?: boolean
    horaExtra?: boolean
    faltaJustificada?: boolean
    observacoes?: boolean
    dataCriacao?: boolean
    dataAtualizacao?: boolean
  }

  export type ControleJornadaOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "funcionarioId" | "data" | "horaEntrada" | "horaSaida" | "horasTrabalhadas" | "horaExtra" | "faltaJustificada" | "observacoes" | "dataCriacao" | "dataAtualizacao", ExtArgs["result"]["controleJornada"]>
  export type ControleJornadaInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    funcionario?: boolean | FuncionarioDefaultArgs<ExtArgs>
  }
  export type ControleJornadaIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    funcionario?: boolean | FuncionarioDefaultArgs<ExtArgs>
  }
  export type ControleJornadaIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    funcionario?: boolean | FuncionarioDefaultArgs<ExtArgs>
  }

  export type $ControleJornadaPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ControleJornada"
    objects: {
      funcionario: Prisma.$FuncionarioPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      funcionarioId: string
      data: Date
      horaEntrada: string
      horaSaida: string
      horasTrabalhadas: number
      horaExtra: number | null
      faltaJustificada: boolean
      observacoes: string | null
      dataCriacao: Date
      dataAtualizacao: Date
    }, ExtArgs["result"]["controleJornada"]>
    composites: {}
  }

  type ControleJornadaGetPayload<S extends boolean | null | undefined | ControleJornadaDefaultArgs> = $Result.GetResult<Prisma.$ControleJornadaPayload, S>

  type ControleJornadaCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ControleJornadaFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ControleJornadaCountAggregateInputType | true
    }

  export interface ControleJornadaDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ControleJornada'], meta: { name: 'ControleJornada' } }
    /**
     * Find zero or one ControleJornada that matches the filter.
     * @param {ControleJornadaFindUniqueArgs} args - Arguments to find a ControleJornada
     * @example
     * // Get one ControleJornada
     * const controleJornada = await prisma.controleJornada.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ControleJornadaFindUniqueArgs>(args: SelectSubset<T, ControleJornadaFindUniqueArgs<ExtArgs>>): Prisma__ControleJornadaClient<$Result.GetResult<Prisma.$ControleJornadaPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ControleJornada that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ControleJornadaFindUniqueOrThrowArgs} args - Arguments to find a ControleJornada
     * @example
     * // Get one ControleJornada
     * const controleJornada = await prisma.controleJornada.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ControleJornadaFindUniqueOrThrowArgs>(args: SelectSubset<T, ControleJornadaFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ControleJornadaClient<$Result.GetResult<Prisma.$ControleJornadaPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ControleJornada that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ControleJornadaFindFirstArgs} args - Arguments to find a ControleJornada
     * @example
     * // Get one ControleJornada
     * const controleJornada = await prisma.controleJornada.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ControleJornadaFindFirstArgs>(args?: SelectSubset<T, ControleJornadaFindFirstArgs<ExtArgs>>): Prisma__ControleJornadaClient<$Result.GetResult<Prisma.$ControleJornadaPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ControleJornada that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ControleJornadaFindFirstOrThrowArgs} args - Arguments to find a ControleJornada
     * @example
     * // Get one ControleJornada
     * const controleJornada = await prisma.controleJornada.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ControleJornadaFindFirstOrThrowArgs>(args?: SelectSubset<T, ControleJornadaFindFirstOrThrowArgs<ExtArgs>>): Prisma__ControleJornadaClient<$Result.GetResult<Prisma.$ControleJornadaPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ControleJornadas that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ControleJornadaFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ControleJornadas
     * const controleJornadas = await prisma.controleJornada.findMany()
     * 
     * // Get first 10 ControleJornadas
     * const controleJornadas = await prisma.controleJornada.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const controleJornadaWithIdOnly = await prisma.controleJornada.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ControleJornadaFindManyArgs>(args?: SelectSubset<T, ControleJornadaFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ControleJornadaPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ControleJornada.
     * @param {ControleJornadaCreateArgs} args - Arguments to create a ControleJornada.
     * @example
     * // Create one ControleJornada
     * const ControleJornada = await prisma.controleJornada.create({
     *   data: {
     *     // ... data to create a ControleJornada
     *   }
     * })
     * 
     */
    create<T extends ControleJornadaCreateArgs>(args: SelectSubset<T, ControleJornadaCreateArgs<ExtArgs>>): Prisma__ControleJornadaClient<$Result.GetResult<Prisma.$ControleJornadaPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ControleJornadas.
     * @param {ControleJornadaCreateManyArgs} args - Arguments to create many ControleJornadas.
     * @example
     * // Create many ControleJornadas
     * const controleJornada = await prisma.controleJornada.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ControleJornadaCreateManyArgs>(args?: SelectSubset<T, ControleJornadaCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ControleJornadas and returns the data saved in the database.
     * @param {ControleJornadaCreateManyAndReturnArgs} args - Arguments to create many ControleJornadas.
     * @example
     * // Create many ControleJornadas
     * const controleJornada = await prisma.controleJornada.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ControleJornadas and only return the `id`
     * const controleJornadaWithIdOnly = await prisma.controleJornada.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ControleJornadaCreateManyAndReturnArgs>(args?: SelectSubset<T, ControleJornadaCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ControleJornadaPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ControleJornada.
     * @param {ControleJornadaDeleteArgs} args - Arguments to delete one ControleJornada.
     * @example
     * // Delete one ControleJornada
     * const ControleJornada = await prisma.controleJornada.delete({
     *   where: {
     *     // ... filter to delete one ControleJornada
     *   }
     * })
     * 
     */
    delete<T extends ControleJornadaDeleteArgs>(args: SelectSubset<T, ControleJornadaDeleteArgs<ExtArgs>>): Prisma__ControleJornadaClient<$Result.GetResult<Prisma.$ControleJornadaPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ControleJornada.
     * @param {ControleJornadaUpdateArgs} args - Arguments to update one ControleJornada.
     * @example
     * // Update one ControleJornada
     * const controleJornada = await prisma.controleJornada.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ControleJornadaUpdateArgs>(args: SelectSubset<T, ControleJornadaUpdateArgs<ExtArgs>>): Prisma__ControleJornadaClient<$Result.GetResult<Prisma.$ControleJornadaPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ControleJornadas.
     * @param {ControleJornadaDeleteManyArgs} args - Arguments to filter ControleJornadas to delete.
     * @example
     * // Delete a few ControleJornadas
     * const { count } = await prisma.controleJornada.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ControleJornadaDeleteManyArgs>(args?: SelectSubset<T, ControleJornadaDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ControleJornadas.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ControleJornadaUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ControleJornadas
     * const controleJornada = await prisma.controleJornada.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ControleJornadaUpdateManyArgs>(args: SelectSubset<T, ControleJornadaUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ControleJornadas and returns the data updated in the database.
     * @param {ControleJornadaUpdateManyAndReturnArgs} args - Arguments to update many ControleJornadas.
     * @example
     * // Update many ControleJornadas
     * const controleJornada = await prisma.controleJornada.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ControleJornadas and only return the `id`
     * const controleJornadaWithIdOnly = await prisma.controleJornada.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ControleJornadaUpdateManyAndReturnArgs>(args: SelectSubset<T, ControleJornadaUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ControleJornadaPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ControleJornada.
     * @param {ControleJornadaUpsertArgs} args - Arguments to update or create a ControleJornada.
     * @example
     * // Update or create a ControleJornada
     * const controleJornada = await prisma.controleJornada.upsert({
     *   create: {
     *     // ... data to create a ControleJornada
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ControleJornada we want to update
     *   }
     * })
     */
    upsert<T extends ControleJornadaUpsertArgs>(args: SelectSubset<T, ControleJornadaUpsertArgs<ExtArgs>>): Prisma__ControleJornadaClient<$Result.GetResult<Prisma.$ControleJornadaPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ControleJornadas.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ControleJornadaCountArgs} args - Arguments to filter ControleJornadas to count.
     * @example
     * // Count the number of ControleJornadas
     * const count = await prisma.controleJornada.count({
     *   where: {
     *     // ... the filter for the ControleJornadas we want to count
     *   }
     * })
    **/
    count<T extends ControleJornadaCountArgs>(
      args?: Subset<T, ControleJornadaCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ControleJornadaCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ControleJornada.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ControleJornadaAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ControleJornadaAggregateArgs>(args: Subset<T, ControleJornadaAggregateArgs>): Prisma.PrismaPromise<GetControleJornadaAggregateType<T>>

    /**
     * Group by ControleJornada.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ControleJornadaGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ControleJornadaGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ControleJornadaGroupByArgs['orderBy'] }
        : { orderBy?: ControleJornadaGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ControleJornadaGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetControleJornadaGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ControleJornada model
   */
  readonly fields: ControleJornadaFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ControleJornada.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ControleJornadaClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    funcionario<T extends FuncionarioDefaultArgs<ExtArgs> = {}>(args?: Subset<T, FuncionarioDefaultArgs<ExtArgs>>): Prisma__FuncionarioClient<$Result.GetResult<Prisma.$FuncionarioPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ControleJornada model
   */
  interface ControleJornadaFieldRefs {
    readonly id: FieldRef<"ControleJornada", 'String'>
    readonly funcionarioId: FieldRef<"ControleJornada", 'String'>
    readonly data: FieldRef<"ControleJornada", 'DateTime'>
    readonly horaEntrada: FieldRef<"ControleJornada", 'String'>
    readonly horaSaida: FieldRef<"ControleJornada", 'String'>
    readonly horasTrabalhadas: FieldRef<"ControleJornada", 'Float'>
    readonly horaExtra: FieldRef<"ControleJornada", 'Float'>
    readonly faltaJustificada: FieldRef<"ControleJornada", 'Boolean'>
    readonly observacoes: FieldRef<"ControleJornada", 'String'>
    readonly dataCriacao: FieldRef<"ControleJornada", 'DateTime'>
    readonly dataAtualizacao: FieldRef<"ControleJornada", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ControleJornada findUnique
   */
  export type ControleJornadaFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ControleJornada
     */
    select?: ControleJornadaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ControleJornada
     */
    omit?: ControleJornadaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ControleJornadaInclude<ExtArgs> | null
    /**
     * Filter, which ControleJornada to fetch.
     */
    where: ControleJornadaWhereUniqueInput
  }

  /**
   * ControleJornada findUniqueOrThrow
   */
  export type ControleJornadaFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ControleJornada
     */
    select?: ControleJornadaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ControleJornada
     */
    omit?: ControleJornadaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ControleJornadaInclude<ExtArgs> | null
    /**
     * Filter, which ControleJornada to fetch.
     */
    where: ControleJornadaWhereUniqueInput
  }

  /**
   * ControleJornada findFirst
   */
  export type ControleJornadaFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ControleJornada
     */
    select?: ControleJornadaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ControleJornada
     */
    omit?: ControleJornadaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ControleJornadaInclude<ExtArgs> | null
    /**
     * Filter, which ControleJornada to fetch.
     */
    where?: ControleJornadaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ControleJornadas to fetch.
     */
    orderBy?: ControleJornadaOrderByWithRelationInput | ControleJornadaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ControleJornadas.
     */
    cursor?: ControleJornadaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ControleJornadas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ControleJornadas.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ControleJornadas.
     */
    distinct?: ControleJornadaScalarFieldEnum | ControleJornadaScalarFieldEnum[]
  }

  /**
   * ControleJornada findFirstOrThrow
   */
  export type ControleJornadaFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ControleJornada
     */
    select?: ControleJornadaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ControleJornada
     */
    omit?: ControleJornadaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ControleJornadaInclude<ExtArgs> | null
    /**
     * Filter, which ControleJornada to fetch.
     */
    where?: ControleJornadaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ControleJornadas to fetch.
     */
    orderBy?: ControleJornadaOrderByWithRelationInput | ControleJornadaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ControleJornadas.
     */
    cursor?: ControleJornadaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ControleJornadas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ControleJornadas.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ControleJornadas.
     */
    distinct?: ControleJornadaScalarFieldEnum | ControleJornadaScalarFieldEnum[]
  }

  /**
   * ControleJornada findMany
   */
  export type ControleJornadaFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ControleJornada
     */
    select?: ControleJornadaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ControleJornada
     */
    omit?: ControleJornadaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ControleJornadaInclude<ExtArgs> | null
    /**
     * Filter, which ControleJornadas to fetch.
     */
    where?: ControleJornadaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ControleJornadas to fetch.
     */
    orderBy?: ControleJornadaOrderByWithRelationInput | ControleJornadaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ControleJornadas.
     */
    cursor?: ControleJornadaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ControleJornadas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ControleJornadas.
     */
    skip?: number
    distinct?: ControleJornadaScalarFieldEnum | ControleJornadaScalarFieldEnum[]
  }

  /**
   * ControleJornada create
   */
  export type ControleJornadaCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ControleJornada
     */
    select?: ControleJornadaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ControleJornada
     */
    omit?: ControleJornadaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ControleJornadaInclude<ExtArgs> | null
    /**
     * The data needed to create a ControleJornada.
     */
    data: XOR<ControleJornadaCreateInput, ControleJornadaUncheckedCreateInput>
  }

  /**
   * ControleJornada createMany
   */
  export type ControleJornadaCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ControleJornadas.
     */
    data: ControleJornadaCreateManyInput | ControleJornadaCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ControleJornada createManyAndReturn
   */
  export type ControleJornadaCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ControleJornada
     */
    select?: ControleJornadaSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ControleJornada
     */
    omit?: ControleJornadaOmit<ExtArgs> | null
    /**
     * The data used to create many ControleJornadas.
     */
    data: ControleJornadaCreateManyInput | ControleJornadaCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ControleJornadaIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ControleJornada update
   */
  export type ControleJornadaUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ControleJornada
     */
    select?: ControleJornadaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ControleJornada
     */
    omit?: ControleJornadaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ControleJornadaInclude<ExtArgs> | null
    /**
     * The data needed to update a ControleJornada.
     */
    data: XOR<ControleJornadaUpdateInput, ControleJornadaUncheckedUpdateInput>
    /**
     * Choose, which ControleJornada to update.
     */
    where: ControleJornadaWhereUniqueInput
  }

  /**
   * ControleJornada updateMany
   */
  export type ControleJornadaUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ControleJornadas.
     */
    data: XOR<ControleJornadaUpdateManyMutationInput, ControleJornadaUncheckedUpdateManyInput>
    /**
     * Filter which ControleJornadas to update
     */
    where?: ControleJornadaWhereInput
    /**
     * Limit how many ControleJornadas to update.
     */
    limit?: number
  }

  /**
   * ControleJornada updateManyAndReturn
   */
  export type ControleJornadaUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ControleJornada
     */
    select?: ControleJornadaSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ControleJornada
     */
    omit?: ControleJornadaOmit<ExtArgs> | null
    /**
     * The data used to update ControleJornadas.
     */
    data: XOR<ControleJornadaUpdateManyMutationInput, ControleJornadaUncheckedUpdateManyInput>
    /**
     * Filter which ControleJornadas to update
     */
    where?: ControleJornadaWhereInput
    /**
     * Limit how many ControleJornadas to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ControleJornadaIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * ControleJornada upsert
   */
  export type ControleJornadaUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ControleJornada
     */
    select?: ControleJornadaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ControleJornada
     */
    omit?: ControleJornadaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ControleJornadaInclude<ExtArgs> | null
    /**
     * The filter to search for the ControleJornada to update in case it exists.
     */
    where: ControleJornadaWhereUniqueInput
    /**
     * In case the ControleJornada found by the `where` argument doesn't exist, create a new ControleJornada with this data.
     */
    create: XOR<ControleJornadaCreateInput, ControleJornadaUncheckedCreateInput>
    /**
     * In case the ControleJornada was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ControleJornadaUpdateInput, ControleJornadaUncheckedUpdateInput>
  }

  /**
   * ControleJornada delete
   */
  export type ControleJornadaDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ControleJornada
     */
    select?: ControleJornadaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ControleJornada
     */
    omit?: ControleJornadaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ControleJornadaInclude<ExtArgs> | null
    /**
     * Filter which ControleJornada to delete.
     */
    where: ControleJornadaWhereUniqueInput
  }

  /**
   * ControleJornada deleteMany
   */
  export type ControleJornadaDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ControleJornadas to delete
     */
    where?: ControleJornadaWhereInput
    /**
     * Limit how many ControleJornadas to delete.
     */
    limit?: number
  }

  /**
   * ControleJornada without action
   */
  export type ControleJornadaDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ControleJornada
     */
    select?: ControleJornadaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ControleJornada
     */
    omit?: ControleJornadaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ControleJornadaInclude<ExtArgs> | null
  }


  /**
   * Model ResumoPagamento
   */

  export type AggregateResumoPagamento = {
    _count: ResumoPagamentoCountAggregateOutputType | null
    _avg: ResumoPagamentoAvgAggregateOutputType | null
    _sum: ResumoPagamentoSumAggregateOutputType | null
    _min: ResumoPagamentoMinAggregateOutputType | null
    _max: ResumoPagamentoMaxAggregateOutputType | null
  }

  export type ResumoPagamentoAvgAggregateOutputType = {
    salarioPrevisto: number | null
    salarioReal: number | null
    extras: number | null
    descontos: number | null
  }

  export type ResumoPagamentoSumAggregateOutputType = {
    salarioPrevisto: number | null
    salarioReal: number | null
    extras: number | null
    descontos: number | null
  }

  export type ResumoPagamentoMinAggregateOutputType = {
    id: string | null
    funcionarioId: string | null
    mes: string | null
    salarioPrevisto: number | null
    salarioReal: number | null
    extras: number | null
    descontos: number | null
    observacoes: string | null
    enviadoParaContador: boolean | null
    dataCriacao: Date | null
    dataAtualizacao: Date | null
  }

  export type ResumoPagamentoMaxAggregateOutputType = {
    id: string | null
    funcionarioId: string | null
    mes: string | null
    salarioPrevisto: number | null
    salarioReal: number | null
    extras: number | null
    descontos: number | null
    observacoes: string | null
    enviadoParaContador: boolean | null
    dataCriacao: Date | null
    dataAtualizacao: Date | null
  }

  export type ResumoPagamentoCountAggregateOutputType = {
    id: number
    funcionarioId: number
    mes: number
    salarioPrevisto: number
    salarioReal: number
    extras: number
    descontos: number
    observacoes: number
    enviadoParaContador: number
    dataCriacao: number
    dataAtualizacao: number
    _all: number
  }


  export type ResumoPagamentoAvgAggregateInputType = {
    salarioPrevisto?: true
    salarioReal?: true
    extras?: true
    descontos?: true
  }

  export type ResumoPagamentoSumAggregateInputType = {
    salarioPrevisto?: true
    salarioReal?: true
    extras?: true
    descontos?: true
  }

  export type ResumoPagamentoMinAggregateInputType = {
    id?: true
    funcionarioId?: true
    mes?: true
    salarioPrevisto?: true
    salarioReal?: true
    extras?: true
    descontos?: true
    observacoes?: true
    enviadoParaContador?: true
    dataCriacao?: true
    dataAtualizacao?: true
  }

  export type ResumoPagamentoMaxAggregateInputType = {
    id?: true
    funcionarioId?: true
    mes?: true
    salarioPrevisto?: true
    salarioReal?: true
    extras?: true
    descontos?: true
    observacoes?: true
    enviadoParaContador?: true
    dataCriacao?: true
    dataAtualizacao?: true
  }

  export type ResumoPagamentoCountAggregateInputType = {
    id?: true
    funcionarioId?: true
    mes?: true
    salarioPrevisto?: true
    salarioReal?: true
    extras?: true
    descontos?: true
    observacoes?: true
    enviadoParaContador?: true
    dataCriacao?: true
    dataAtualizacao?: true
    _all?: true
  }

  export type ResumoPagamentoAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ResumoPagamento to aggregate.
     */
    where?: ResumoPagamentoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ResumoPagamentos to fetch.
     */
    orderBy?: ResumoPagamentoOrderByWithRelationInput | ResumoPagamentoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ResumoPagamentoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ResumoPagamentos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ResumoPagamentos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ResumoPagamentos
    **/
    _count?: true | ResumoPagamentoCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ResumoPagamentoAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ResumoPagamentoSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ResumoPagamentoMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ResumoPagamentoMaxAggregateInputType
  }

  export type GetResumoPagamentoAggregateType<T extends ResumoPagamentoAggregateArgs> = {
        [P in keyof T & keyof AggregateResumoPagamento]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateResumoPagamento[P]>
      : GetScalarType<T[P], AggregateResumoPagamento[P]>
  }




  export type ResumoPagamentoGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ResumoPagamentoWhereInput
    orderBy?: ResumoPagamentoOrderByWithAggregationInput | ResumoPagamentoOrderByWithAggregationInput[]
    by: ResumoPagamentoScalarFieldEnum[] | ResumoPagamentoScalarFieldEnum
    having?: ResumoPagamentoScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ResumoPagamentoCountAggregateInputType | true
    _avg?: ResumoPagamentoAvgAggregateInputType
    _sum?: ResumoPagamentoSumAggregateInputType
    _min?: ResumoPagamentoMinAggregateInputType
    _max?: ResumoPagamentoMaxAggregateInputType
  }

  export type ResumoPagamentoGroupByOutputType = {
    id: string
    funcionarioId: string
    mes: string
    salarioPrevisto: number
    salarioReal: number
    extras: number | null
    descontos: number | null
    observacoes: string | null
    enviadoParaContador: boolean
    dataCriacao: Date
    dataAtualizacao: Date
    _count: ResumoPagamentoCountAggregateOutputType | null
    _avg: ResumoPagamentoAvgAggregateOutputType | null
    _sum: ResumoPagamentoSumAggregateOutputType | null
    _min: ResumoPagamentoMinAggregateOutputType | null
    _max: ResumoPagamentoMaxAggregateOutputType | null
  }

  type GetResumoPagamentoGroupByPayload<T extends ResumoPagamentoGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ResumoPagamentoGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ResumoPagamentoGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ResumoPagamentoGroupByOutputType[P]>
            : GetScalarType<T[P], ResumoPagamentoGroupByOutputType[P]>
        }
      >
    >


  export type ResumoPagamentoSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    funcionarioId?: boolean
    mes?: boolean
    salarioPrevisto?: boolean
    salarioReal?: boolean
    extras?: boolean
    descontos?: boolean
    observacoes?: boolean
    enviadoParaContador?: boolean
    dataCriacao?: boolean
    dataAtualizacao?: boolean
    funcionario?: boolean | FuncionarioDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["resumoPagamento"]>

  export type ResumoPagamentoSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    funcionarioId?: boolean
    mes?: boolean
    salarioPrevisto?: boolean
    salarioReal?: boolean
    extras?: boolean
    descontos?: boolean
    observacoes?: boolean
    enviadoParaContador?: boolean
    dataCriacao?: boolean
    dataAtualizacao?: boolean
    funcionario?: boolean | FuncionarioDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["resumoPagamento"]>

  export type ResumoPagamentoSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    funcionarioId?: boolean
    mes?: boolean
    salarioPrevisto?: boolean
    salarioReal?: boolean
    extras?: boolean
    descontos?: boolean
    observacoes?: boolean
    enviadoParaContador?: boolean
    dataCriacao?: boolean
    dataAtualizacao?: boolean
    funcionario?: boolean | FuncionarioDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["resumoPagamento"]>

  export type ResumoPagamentoSelectScalar = {
    id?: boolean
    funcionarioId?: boolean
    mes?: boolean
    salarioPrevisto?: boolean
    salarioReal?: boolean
    extras?: boolean
    descontos?: boolean
    observacoes?: boolean
    enviadoParaContador?: boolean
    dataCriacao?: boolean
    dataAtualizacao?: boolean
  }

  export type ResumoPagamentoOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "funcionarioId" | "mes" | "salarioPrevisto" | "salarioReal" | "extras" | "descontos" | "observacoes" | "enviadoParaContador" | "dataCriacao" | "dataAtualizacao", ExtArgs["result"]["resumoPagamento"]>
  export type ResumoPagamentoInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    funcionario?: boolean | FuncionarioDefaultArgs<ExtArgs>
  }
  export type ResumoPagamentoIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    funcionario?: boolean | FuncionarioDefaultArgs<ExtArgs>
  }
  export type ResumoPagamentoIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    funcionario?: boolean | FuncionarioDefaultArgs<ExtArgs>
  }

  export type $ResumoPagamentoPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ResumoPagamento"
    objects: {
      funcionario: Prisma.$FuncionarioPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      funcionarioId: string
      mes: string
      salarioPrevisto: number
      salarioReal: number
      extras: number | null
      descontos: number | null
      observacoes: string | null
      enviadoParaContador: boolean
      dataCriacao: Date
      dataAtualizacao: Date
    }, ExtArgs["result"]["resumoPagamento"]>
    composites: {}
  }

  type ResumoPagamentoGetPayload<S extends boolean | null | undefined | ResumoPagamentoDefaultArgs> = $Result.GetResult<Prisma.$ResumoPagamentoPayload, S>

  type ResumoPagamentoCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ResumoPagamentoFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ResumoPagamentoCountAggregateInputType | true
    }

  export interface ResumoPagamentoDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ResumoPagamento'], meta: { name: 'ResumoPagamento' } }
    /**
     * Find zero or one ResumoPagamento that matches the filter.
     * @param {ResumoPagamentoFindUniqueArgs} args - Arguments to find a ResumoPagamento
     * @example
     * // Get one ResumoPagamento
     * const resumoPagamento = await prisma.resumoPagamento.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ResumoPagamentoFindUniqueArgs>(args: SelectSubset<T, ResumoPagamentoFindUniqueArgs<ExtArgs>>): Prisma__ResumoPagamentoClient<$Result.GetResult<Prisma.$ResumoPagamentoPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ResumoPagamento that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ResumoPagamentoFindUniqueOrThrowArgs} args - Arguments to find a ResumoPagamento
     * @example
     * // Get one ResumoPagamento
     * const resumoPagamento = await prisma.resumoPagamento.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ResumoPagamentoFindUniqueOrThrowArgs>(args: SelectSubset<T, ResumoPagamentoFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ResumoPagamentoClient<$Result.GetResult<Prisma.$ResumoPagamentoPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ResumoPagamento that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ResumoPagamentoFindFirstArgs} args - Arguments to find a ResumoPagamento
     * @example
     * // Get one ResumoPagamento
     * const resumoPagamento = await prisma.resumoPagamento.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ResumoPagamentoFindFirstArgs>(args?: SelectSubset<T, ResumoPagamentoFindFirstArgs<ExtArgs>>): Prisma__ResumoPagamentoClient<$Result.GetResult<Prisma.$ResumoPagamentoPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ResumoPagamento that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ResumoPagamentoFindFirstOrThrowArgs} args - Arguments to find a ResumoPagamento
     * @example
     * // Get one ResumoPagamento
     * const resumoPagamento = await prisma.resumoPagamento.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ResumoPagamentoFindFirstOrThrowArgs>(args?: SelectSubset<T, ResumoPagamentoFindFirstOrThrowArgs<ExtArgs>>): Prisma__ResumoPagamentoClient<$Result.GetResult<Prisma.$ResumoPagamentoPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ResumoPagamentos that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ResumoPagamentoFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ResumoPagamentos
     * const resumoPagamentos = await prisma.resumoPagamento.findMany()
     * 
     * // Get first 10 ResumoPagamentos
     * const resumoPagamentos = await prisma.resumoPagamento.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const resumoPagamentoWithIdOnly = await prisma.resumoPagamento.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ResumoPagamentoFindManyArgs>(args?: SelectSubset<T, ResumoPagamentoFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ResumoPagamentoPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ResumoPagamento.
     * @param {ResumoPagamentoCreateArgs} args - Arguments to create a ResumoPagamento.
     * @example
     * // Create one ResumoPagamento
     * const ResumoPagamento = await prisma.resumoPagamento.create({
     *   data: {
     *     // ... data to create a ResumoPagamento
     *   }
     * })
     * 
     */
    create<T extends ResumoPagamentoCreateArgs>(args: SelectSubset<T, ResumoPagamentoCreateArgs<ExtArgs>>): Prisma__ResumoPagamentoClient<$Result.GetResult<Prisma.$ResumoPagamentoPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ResumoPagamentos.
     * @param {ResumoPagamentoCreateManyArgs} args - Arguments to create many ResumoPagamentos.
     * @example
     * // Create many ResumoPagamentos
     * const resumoPagamento = await prisma.resumoPagamento.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ResumoPagamentoCreateManyArgs>(args?: SelectSubset<T, ResumoPagamentoCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ResumoPagamentos and returns the data saved in the database.
     * @param {ResumoPagamentoCreateManyAndReturnArgs} args - Arguments to create many ResumoPagamentos.
     * @example
     * // Create many ResumoPagamentos
     * const resumoPagamento = await prisma.resumoPagamento.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ResumoPagamentos and only return the `id`
     * const resumoPagamentoWithIdOnly = await prisma.resumoPagamento.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ResumoPagamentoCreateManyAndReturnArgs>(args?: SelectSubset<T, ResumoPagamentoCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ResumoPagamentoPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ResumoPagamento.
     * @param {ResumoPagamentoDeleteArgs} args - Arguments to delete one ResumoPagamento.
     * @example
     * // Delete one ResumoPagamento
     * const ResumoPagamento = await prisma.resumoPagamento.delete({
     *   where: {
     *     // ... filter to delete one ResumoPagamento
     *   }
     * })
     * 
     */
    delete<T extends ResumoPagamentoDeleteArgs>(args: SelectSubset<T, ResumoPagamentoDeleteArgs<ExtArgs>>): Prisma__ResumoPagamentoClient<$Result.GetResult<Prisma.$ResumoPagamentoPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ResumoPagamento.
     * @param {ResumoPagamentoUpdateArgs} args - Arguments to update one ResumoPagamento.
     * @example
     * // Update one ResumoPagamento
     * const resumoPagamento = await prisma.resumoPagamento.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ResumoPagamentoUpdateArgs>(args: SelectSubset<T, ResumoPagamentoUpdateArgs<ExtArgs>>): Prisma__ResumoPagamentoClient<$Result.GetResult<Prisma.$ResumoPagamentoPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ResumoPagamentos.
     * @param {ResumoPagamentoDeleteManyArgs} args - Arguments to filter ResumoPagamentos to delete.
     * @example
     * // Delete a few ResumoPagamentos
     * const { count } = await prisma.resumoPagamento.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ResumoPagamentoDeleteManyArgs>(args?: SelectSubset<T, ResumoPagamentoDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ResumoPagamentos.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ResumoPagamentoUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ResumoPagamentos
     * const resumoPagamento = await prisma.resumoPagamento.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ResumoPagamentoUpdateManyArgs>(args: SelectSubset<T, ResumoPagamentoUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ResumoPagamentos and returns the data updated in the database.
     * @param {ResumoPagamentoUpdateManyAndReturnArgs} args - Arguments to update many ResumoPagamentos.
     * @example
     * // Update many ResumoPagamentos
     * const resumoPagamento = await prisma.resumoPagamento.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ResumoPagamentos and only return the `id`
     * const resumoPagamentoWithIdOnly = await prisma.resumoPagamento.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ResumoPagamentoUpdateManyAndReturnArgs>(args: SelectSubset<T, ResumoPagamentoUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ResumoPagamentoPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ResumoPagamento.
     * @param {ResumoPagamentoUpsertArgs} args - Arguments to update or create a ResumoPagamento.
     * @example
     * // Update or create a ResumoPagamento
     * const resumoPagamento = await prisma.resumoPagamento.upsert({
     *   create: {
     *     // ... data to create a ResumoPagamento
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ResumoPagamento we want to update
     *   }
     * })
     */
    upsert<T extends ResumoPagamentoUpsertArgs>(args: SelectSubset<T, ResumoPagamentoUpsertArgs<ExtArgs>>): Prisma__ResumoPagamentoClient<$Result.GetResult<Prisma.$ResumoPagamentoPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ResumoPagamentos.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ResumoPagamentoCountArgs} args - Arguments to filter ResumoPagamentos to count.
     * @example
     * // Count the number of ResumoPagamentos
     * const count = await prisma.resumoPagamento.count({
     *   where: {
     *     // ... the filter for the ResumoPagamentos we want to count
     *   }
     * })
    **/
    count<T extends ResumoPagamentoCountArgs>(
      args?: Subset<T, ResumoPagamentoCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ResumoPagamentoCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ResumoPagamento.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ResumoPagamentoAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ResumoPagamentoAggregateArgs>(args: Subset<T, ResumoPagamentoAggregateArgs>): Prisma.PrismaPromise<GetResumoPagamentoAggregateType<T>>

    /**
     * Group by ResumoPagamento.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ResumoPagamentoGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ResumoPagamentoGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ResumoPagamentoGroupByArgs['orderBy'] }
        : { orderBy?: ResumoPagamentoGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ResumoPagamentoGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetResumoPagamentoGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ResumoPagamento model
   */
  readonly fields: ResumoPagamentoFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ResumoPagamento.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ResumoPagamentoClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    funcionario<T extends FuncionarioDefaultArgs<ExtArgs> = {}>(args?: Subset<T, FuncionarioDefaultArgs<ExtArgs>>): Prisma__FuncionarioClient<$Result.GetResult<Prisma.$FuncionarioPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ResumoPagamento model
   */
  interface ResumoPagamentoFieldRefs {
    readonly id: FieldRef<"ResumoPagamento", 'String'>
    readonly funcionarioId: FieldRef<"ResumoPagamento", 'String'>
    readonly mes: FieldRef<"ResumoPagamento", 'String'>
    readonly salarioPrevisto: FieldRef<"ResumoPagamento", 'Float'>
    readonly salarioReal: FieldRef<"ResumoPagamento", 'Float'>
    readonly extras: FieldRef<"ResumoPagamento", 'Float'>
    readonly descontos: FieldRef<"ResumoPagamento", 'Float'>
    readonly observacoes: FieldRef<"ResumoPagamento", 'String'>
    readonly enviadoParaContador: FieldRef<"ResumoPagamento", 'Boolean'>
    readonly dataCriacao: FieldRef<"ResumoPagamento", 'DateTime'>
    readonly dataAtualizacao: FieldRef<"ResumoPagamento", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ResumoPagamento findUnique
   */
  export type ResumoPagamentoFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ResumoPagamento
     */
    select?: ResumoPagamentoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ResumoPagamento
     */
    omit?: ResumoPagamentoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ResumoPagamentoInclude<ExtArgs> | null
    /**
     * Filter, which ResumoPagamento to fetch.
     */
    where: ResumoPagamentoWhereUniqueInput
  }

  /**
   * ResumoPagamento findUniqueOrThrow
   */
  export type ResumoPagamentoFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ResumoPagamento
     */
    select?: ResumoPagamentoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ResumoPagamento
     */
    omit?: ResumoPagamentoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ResumoPagamentoInclude<ExtArgs> | null
    /**
     * Filter, which ResumoPagamento to fetch.
     */
    where: ResumoPagamentoWhereUniqueInput
  }

  /**
   * ResumoPagamento findFirst
   */
  export type ResumoPagamentoFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ResumoPagamento
     */
    select?: ResumoPagamentoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ResumoPagamento
     */
    omit?: ResumoPagamentoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ResumoPagamentoInclude<ExtArgs> | null
    /**
     * Filter, which ResumoPagamento to fetch.
     */
    where?: ResumoPagamentoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ResumoPagamentos to fetch.
     */
    orderBy?: ResumoPagamentoOrderByWithRelationInput | ResumoPagamentoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ResumoPagamentos.
     */
    cursor?: ResumoPagamentoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ResumoPagamentos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ResumoPagamentos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ResumoPagamentos.
     */
    distinct?: ResumoPagamentoScalarFieldEnum | ResumoPagamentoScalarFieldEnum[]
  }

  /**
   * ResumoPagamento findFirstOrThrow
   */
  export type ResumoPagamentoFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ResumoPagamento
     */
    select?: ResumoPagamentoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ResumoPagamento
     */
    omit?: ResumoPagamentoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ResumoPagamentoInclude<ExtArgs> | null
    /**
     * Filter, which ResumoPagamento to fetch.
     */
    where?: ResumoPagamentoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ResumoPagamentos to fetch.
     */
    orderBy?: ResumoPagamentoOrderByWithRelationInput | ResumoPagamentoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ResumoPagamentos.
     */
    cursor?: ResumoPagamentoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ResumoPagamentos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ResumoPagamentos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ResumoPagamentos.
     */
    distinct?: ResumoPagamentoScalarFieldEnum | ResumoPagamentoScalarFieldEnum[]
  }

  /**
   * ResumoPagamento findMany
   */
  export type ResumoPagamentoFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ResumoPagamento
     */
    select?: ResumoPagamentoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ResumoPagamento
     */
    omit?: ResumoPagamentoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ResumoPagamentoInclude<ExtArgs> | null
    /**
     * Filter, which ResumoPagamentos to fetch.
     */
    where?: ResumoPagamentoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ResumoPagamentos to fetch.
     */
    orderBy?: ResumoPagamentoOrderByWithRelationInput | ResumoPagamentoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ResumoPagamentos.
     */
    cursor?: ResumoPagamentoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ResumoPagamentos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ResumoPagamentos.
     */
    skip?: number
    distinct?: ResumoPagamentoScalarFieldEnum | ResumoPagamentoScalarFieldEnum[]
  }

  /**
   * ResumoPagamento create
   */
  export type ResumoPagamentoCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ResumoPagamento
     */
    select?: ResumoPagamentoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ResumoPagamento
     */
    omit?: ResumoPagamentoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ResumoPagamentoInclude<ExtArgs> | null
    /**
     * The data needed to create a ResumoPagamento.
     */
    data: XOR<ResumoPagamentoCreateInput, ResumoPagamentoUncheckedCreateInput>
  }

  /**
   * ResumoPagamento createMany
   */
  export type ResumoPagamentoCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ResumoPagamentos.
     */
    data: ResumoPagamentoCreateManyInput | ResumoPagamentoCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ResumoPagamento createManyAndReturn
   */
  export type ResumoPagamentoCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ResumoPagamento
     */
    select?: ResumoPagamentoSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ResumoPagamento
     */
    omit?: ResumoPagamentoOmit<ExtArgs> | null
    /**
     * The data used to create many ResumoPagamentos.
     */
    data: ResumoPagamentoCreateManyInput | ResumoPagamentoCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ResumoPagamentoIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ResumoPagamento update
   */
  export type ResumoPagamentoUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ResumoPagamento
     */
    select?: ResumoPagamentoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ResumoPagamento
     */
    omit?: ResumoPagamentoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ResumoPagamentoInclude<ExtArgs> | null
    /**
     * The data needed to update a ResumoPagamento.
     */
    data: XOR<ResumoPagamentoUpdateInput, ResumoPagamentoUncheckedUpdateInput>
    /**
     * Choose, which ResumoPagamento to update.
     */
    where: ResumoPagamentoWhereUniqueInput
  }

  /**
   * ResumoPagamento updateMany
   */
  export type ResumoPagamentoUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ResumoPagamentos.
     */
    data: XOR<ResumoPagamentoUpdateManyMutationInput, ResumoPagamentoUncheckedUpdateManyInput>
    /**
     * Filter which ResumoPagamentos to update
     */
    where?: ResumoPagamentoWhereInput
    /**
     * Limit how many ResumoPagamentos to update.
     */
    limit?: number
  }

  /**
   * ResumoPagamento updateManyAndReturn
   */
  export type ResumoPagamentoUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ResumoPagamento
     */
    select?: ResumoPagamentoSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ResumoPagamento
     */
    omit?: ResumoPagamentoOmit<ExtArgs> | null
    /**
     * The data used to update ResumoPagamentos.
     */
    data: XOR<ResumoPagamentoUpdateManyMutationInput, ResumoPagamentoUncheckedUpdateManyInput>
    /**
     * Filter which ResumoPagamentos to update
     */
    where?: ResumoPagamentoWhereInput
    /**
     * Limit how many ResumoPagamentos to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ResumoPagamentoIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * ResumoPagamento upsert
   */
  export type ResumoPagamentoUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ResumoPagamento
     */
    select?: ResumoPagamentoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ResumoPagamento
     */
    omit?: ResumoPagamentoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ResumoPagamentoInclude<ExtArgs> | null
    /**
     * The filter to search for the ResumoPagamento to update in case it exists.
     */
    where: ResumoPagamentoWhereUniqueInput
    /**
     * In case the ResumoPagamento found by the `where` argument doesn't exist, create a new ResumoPagamento with this data.
     */
    create: XOR<ResumoPagamentoCreateInput, ResumoPagamentoUncheckedCreateInput>
    /**
     * In case the ResumoPagamento was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ResumoPagamentoUpdateInput, ResumoPagamentoUncheckedUpdateInput>
  }

  /**
   * ResumoPagamento delete
   */
  export type ResumoPagamentoDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ResumoPagamento
     */
    select?: ResumoPagamentoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ResumoPagamento
     */
    omit?: ResumoPagamentoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ResumoPagamentoInclude<ExtArgs> | null
    /**
     * Filter which ResumoPagamento to delete.
     */
    where: ResumoPagamentoWhereUniqueInput
  }

  /**
   * ResumoPagamento deleteMany
   */
  export type ResumoPagamentoDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ResumoPagamentos to delete
     */
    where?: ResumoPagamentoWhereInput
    /**
     * Limit how many ResumoPagamentos to delete.
     */
    limit?: number
  }

  /**
   * ResumoPagamento without action
   */
  export type ResumoPagamentoDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ResumoPagamento
     */
    select?: ResumoPagamentoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ResumoPagamento
     */
    omit?: ResumoPagamentoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ResumoPagamentoInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const UserScalarFieldEnum: {
    id: 'id',
    nome: 'nome',
    email: 'email',
    cargo: 'cargo',
    telefone: 'telefone',
    setor: 'setor',
    password: 'password',
    permissoes: 'permissoes',
    tipoNegocio: 'tipoNegocio',
    numeroFuncionarios: 'numeroFuncionarios',
    passwordResetToken: 'passwordResetToken',
    passwordResetExpires: 'passwordResetExpires',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const PagamentoScalarFieldEnum: {
    id: 'id',
    valor: 'valor',
    data: 'data',
    status: 'status',
    descricao: 'descricao',
    userId: 'userId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type PagamentoScalarFieldEnum = (typeof PagamentoScalarFieldEnum)[keyof typeof PagamentoScalarFieldEnum]


  export const InventarioScalarFieldEnum: {
    id: 'id',
    nome: 'nome',
    quantidade: 'quantidade',
    preco: 'preco',
    userId: 'userId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type InventarioScalarFieldEnum = (typeof InventarioScalarFieldEnum)[keyof typeof InventarioScalarFieldEnum]


  export const FuncionarioScalarFieldEnum: {
    id: 'id',
    nome: 'nome',
    cargo: 'cargo',
    tipoContrato: 'tipoContrato',
    dataAdmissao: 'dataAdmissao',
    salarioBruto: 'salarioBruto',
    pagamentoPorHora: 'pagamentoPorHora',
    horasSemana: 'horasSemana',
    diasTrabalho: 'diasTrabalho',
    iban: 'iban',
    status: 'status',
    observacoes: 'observacoes',
    contratoUploadUrl: 'contratoUploadUrl',
    dataCriacao: 'dataCriacao',
    dataAtualizacao: 'dataAtualizacao'
  };

  export type FuncionarioScalarFieldEnum = (typeof FuncionarioScalarFieldEnum)[keyof typeof FuncionarioScalarFieldEnum]


  export const ControleJornadaScalarFieldEnum: {
    id: 'id',
    funcionarioId: 'funcionarioId',
    data: 'data',
    horaEntrada: 'horaEntrada',
    horaSaida: 'horaSaida',
    horasTrabalhadas: 'horasTrabalhadas',
    horaExtra: 'horaExtra',
    faltaJustificada: 'faltaJustificada',
    observacoes: 'observacoes',
    dataCriacao: 'dataCriacao',
    dataAtualizacao: 'dataAtualizacao'
  };

  export type ControleJornadaScalarFieldEnum = (typeof ControleJornadaScalarFieldEnum)[keyof typeof ControleJornadaScalarFieldEnum]


  export const ResumoPagamentoScalarFieldEnum: {
    id: 'id',
    funcionarioId: 'funcionarioId',
    mes: 'mes',
    salarioPrevisto: 'salarioPrevisto',
    salarioReal: 'salarioReal',
    extras: 'extras',
    descontos: 'descontos',
    observacoes: 'observacoes',
    enviadoParaContador: 'enviadoParaContador',
    dataCriacao: 'dataCriacao',
    dataAtualizacao: 'dataAtualizacao'
  };

  export type ResumoPagamentoScalarFieldEnum = (typeof ResumoPagamentoScalarFieldEnum)[keyof typeof ResumoPagamentoScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    
  /**
   * Deep Input Types
   */


  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: StringFilter<"User"> | string
    nome?: StringFilter<"User"> | string
    email?: StringFilter<"User"> | string
    cargo?: StringNullableFilter<"User"> | string | null
    telefone?: StringNullableFilter<"User"> | string | null
    setor?: StringNullableFilter<"User"> | string | null
    password?: StringFilter<"User"> | string
    permissoes?: StringFilter<"User"> | string
    tipoNegocio?: StringNullableFilter<"User"> | string | null
    numeroFuncionarios?: IntNullableFilter<"User"> | number | null
    passwordResetToken?: StringNullableFilter<"User"> | string | null
    passwordResetExpires?: DateTimeNullableFilter<"User"> | Date | string | null
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    pagamentos?: PagamentoListRelationFilter
    inventario?: InventarioListRelationFilter
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    nome?: SortOrder
    email?: SortOrder
    cargo?: SortOrderInput | SortOrder
    telefone?: SortOrderInput | SortOrder
    setor?: SortOrderInput | SortOrder
    password?: SortOrder
    permissoes?: SortOrder
    tipoNegocio?: SortOrderInput | SortOrder
    numeroFuncionarios?: SortOrderInput | SortOrder
    passwordResetToken?: SortOrderInput | SortOrder
    passwordResetExpires?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    pagamentos?: PagamentoOrderByRelationAggregateInput
    inventario?: InventarioOrderByRelationAggregateInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    email?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    nome?: StringFilter<"User"> | string
    cargo?: StringNullableFilter<"User"> | string | null
    telefone?: StringNullableFilter<"User"> | string | null
    setor?: StringNullableFilter<"User"> | string | null
    password?: StringFilter<"User"> | string
    permissoes?: StringFilter<"User"> | string
    tipoNegocio?: StringNullableFilter<"User"> | string | null
    numeroFuncionarios?: IntNullableFilter<"User"> | number | null
    passwordResetToken?: StringNullableFilter<"User"> | string | null
    passwordResetExpires?: DateTimeNullableFilter<"User"> | Date | string | null
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    pagamentos?: PagamentoListRelationFilter
    inventario?: InventarioListRelationFilter
  }, "id" | "email">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    nome?: SortOrder
    email?: SortOrder
    cargo?: SortOrderInput | SortOrder
    telefone?: SortOrderInput | SortOrder
    setor?: SortOrderInput | SortOrder
    password?: SortOrder
    permissoes?: SortOrder
    tipoNegocio?: SortOrderInput | SortOrder
    numeroFuncionarios?: SortOrderInput | SortOrder
    passwordResetToken?: SortOrderInput | SortOrder
    passwordResetExpires?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: UserCountOrderByAggregateInput
    _avg?: UserAvgOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
    _sum?: UserSumOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"User"> | string
    nome?: StringWithAggregatesFilter<"User"> | string
    email?: StringWithAggregatesFilter<"User"> | string
    cargo?: StringNullableWithAggregatesFilter<"User"> | string | null
    telefone?: StringNullableWithAggregatesFilter<"User"> | string | null
    setor?: StringNullableWithAggregatesFilter<"User"> | string | null
    password?: StringWithAggregatesFilter<"User"> | string
    permissoes?: StringWithAggregatesFilter<"User"> | string
    tipoNegocio?: StringNullableWithAggregatesFilter<"User"> | string | null
    numeroFuncionarios?: IntNullableWithAggregatesFilter<"User"> | number | null
    passwordResetToken?: StringNullableWithAggregatesFilter<"User"> | string | null
    passwordResetExpires?: DateTimeNullableWithAggregatesFilter<"User"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
  }

  export type PagamentoWhereInput = {
    AND?: PagamentoWhereInput | PagamentoWhereInput[]
    OR?: PagamentoWhereInput[]
    NOT?: PagamentoWhereInput | PagamentoWhereInput[]
    id?: StringFilter<"Pagamento"> | string
    valor?: FloatFilter<"Pagamento"> | number
    data?: DateTimeFilter<"Pagamento"> | Date | string
    status?: StringFilter<"Pagamento"> | string
    descricao?: StringNullableFilter<"Pagamento"> | string | null
    userId?: StringFilter<"Pagamento"> | string
    createdAt?: DateTimeFilter<"Pagamento"> | Date | string
    updatedAt?: DateTimeFilter<"Pagamento"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type PagamentoOrderByWithRelationInput = {
    id?: SortOrder
    valor?: SortOrder
    data?: SortOrder
    status?: SortOrder
    descricao?: SortOrderInput | SortOrder
    userId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type PagamentoWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: PagamentoWhereInput | PagamentoWhereInput[]
    OR?: PagamentoWhereInput[]
    NOT?: PagamentoWhereInput | PagamentoWhereInput[]
    valor?: FloatFilter<"Pagamento"> | number
    data?: DateTimeFilter<"Pagamento"> | Date | string
    status?: StringFilter<"Pagamento"> | string
    descricao?: StringNullableFilter<"Pagamento"> | string | null
    userId?: StringFilter<"Pagamento"> | string
    createdAt?: DateTimeFilter<"Pagamento"> | Date | string
    updatedAt?: DateTimeFilter<"Pagamento"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id">

  export type PagamentoOrderByWithAggregationInput = {
    id?: SortOrder
    valor?: SortOrder
    data?: SortOrder
    status?: SortOrder
    descricao?: SortOrderInput | SortOrder
    userId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: PagamentoCountOrderByAggregateInput
    _avg?: PagamentoAvgOrderByAggregateInput
    _max?: PagamentoMaxOrderByAggregateInput
    _min?: PagamentoMinOrderByAggregateInput
    _sum?: PagamentoSumOrderByAggregateInput
  }

  export type PagamentoScalarWhereWithAggregatesInput = {
    AND?: PagamentoScalarWhereWithAggregatesInput | PagamentoScalarWhereWithAggregatesInput[]
    OR?: PagamentoScalarWhereWithAggregatesInput[]
    NOT?: PagamentoScalarWhereWithAggregatesInput | PagamentoScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Pagamento"> | string
    valor?: FloatWithAggregatesFilter<"Pagamento"> | number
    data?: DateTimeWithAggregatesFilter<"Pagamento"> | Date | string
    status?: StringWithAggregatesFilter<"Pagamento"> | string
    descricao?: StringNullableWithAggregatesFilter<"Pagamento"> | string | null
    userId?: StringWithAggregatesFilter<"Pagamento"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Pagamento"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Pagamento"> | Date | string
  }

  export type InventarioWhereInput = {
    AND?: InventarioWhereInput | InventarioWhereInput[]
    OR?: InventarioWhereInput[]
    NOT?: InventarioWhereInput | InventarioWhereInput[]
    id?: StringFilter<"Inventario"> | string
    nome?: StringFilter<"Inventario"> | string
    quantidade?: IntFilter<"Inventario"> | number
    preco?: FloatFilter<"Inventario"> | number
    userId?: StringFilter<"Inventario"> | string
    createdAt?: DateTimeFilter<"Inventario"> | Date | string
    updatedAt?: DateTimeFilter<"Inventario"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type InventarioOrderByWithRelationInput = {
    id?: SortOrder
    nome?: SortOrder
    quantidade?: SortOrder
    preco?: SortOrder
    userId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type InventarioWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: InventarioWhereInput | InventarioWhereInput[]
    OR?: InventarioWhereInput[]
    NOT?: InventarioWhereInput | InventarioWhereInput[]
    nome?: StringFilter<"Inventario"> | string
    quantidade?: IntFilter<"Inventario"> | number
    preco?: FloatFilter<"Inventario"> | number
    userId?: StringFilter<"Inventario"> | string
    createdAt?: DateTimeFilter<"Inventario"> | Date | string
    updatedAt?: DateTimeFilter<"Inventario"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id">

  export type InventarioOrderByWithAggregationInput = {
    id?: SortOrder
    nome?: SortOrder
    quantidade?: SortOrder
    preco?: SortOrder
    userId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: InventarioCountOrderByAggregateInput
    _avg?: InventarioAvgOrderByAggregateInput
    _max?: InventarioMaxOrderByAggregateInput
    _min?: InventarioMinOrderByAggregateInput
    _sum?: InventarioSumOrderByAggregateInput
  }

  export type InventarioScalarWhereWithAggregatesInput = {
    AND?: InventarioScalarWhereWithAggregatesInput | InventarioScalarWhereWithAggregatesInput[]
    OR?: InventarioScalarWhereWithAggregatesInput[]
    NOT?: InventarioScalarWhereWithAggregatesInput | InventarioScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Inventario"> | string
    nome?: StringWithAggregatesFilter<"Inventario"> | string
    quantidade?: IntWithAggregatesFilter<"Inventario"> | number
    preco?: FloatWithAggregatesFilter<"Inventario"> | number
    userId?: StringWithAggregatesFilter<"Inventario"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Inventario"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Inventario"> | Date | string
  }

  export type FuncionarioWhereInput = {
    AND?: FuncionarioWhereInput | FuncionarioWhereInput[]
    OR?: FuncionarioWhereInput[]
    NOT?: FuncionarioWhereInput | FuncionarioWhereInput[]
    id?: StringFilter<"Funcionario"> | string
    nome?: StringFilter<"Funcionario"> | string
    cargo?: StringFilter<"Funcionario"> | string
    tipoContrato?: StringFilter<"Funcionario"> | string
    dataAdmissao?: DateTimeFilter<"Funcionario"> | Date | string
    salarioBruto?: FloatFilter<"Funcionario"> | number
    pagamentoPorHora?: BoolFilter<"Funcionario"> | boolean
    horasSemana?: FloatFilter<"Funcionario"> | number
    diasTrabalho?: StringNullableListFilter<"Funcionario">
    iban?: StringNullableFilter<"Funcionario"> | string | null
    status?: StringFilter<"Funcionario"> | string
    observacoes?: StringNullableFilter<"Funcionario"> | string | null
    contratoUploadUrl?: StringNullableFilter<"Funcionario"> | string | null
    dataCriacao?: DateTimeFilter<"Funcionario"> | Date | string
    dataAtualizacao?: DateTimeFilter<"Funcionario"> | Date | string
    controleJornada?: ControleJornadaListRelationFilter
    resumoPagamento?: ResumoPagamentoListRelationFilter
  }

  export type FuncionarioOrderByWithRelationInput = {
    id?: SortOrder
    nome?: SortOrder
    cargo?: SortOrder
    tipoContrato?: SortOrder
    dataAdmissao?: SortOrder
    salarioBruto?: SortOrder
    pagamentoPorHora?: SortOrder
    horasSemana?: SortOrder
    diasTrabalho?: SortOrder
    iban?: SortOrderInput | SortOrder
    status?: SortOrder
    observacoes?: SortOrderInput | SortOrder
    contratoUploadUrl?: SortOrderInput | SortOrder
    dataCriacao?: SortOrder
    dataAtualizacao?: SortOrder
    controleJornada?: ControleJornadaOrderByRelationAggregateInput
    resumoPagamento?: ResumoPagamentoOrderByRelationAggregateInput
  }

  export type FuncionarioWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: FuncionarioWhereInput | FuncionarioWhereInput[]
    OR?: FuncionarioWhereInput[]
    NOT?: FuncionarioWhereInput | FuncionarioWhereInput[]
    nome?: StringFilter<"Funcionario"> | string
    cargo?: StringFilter<"Funcionario"> | string
    tipoContrato?: StringFilter<"Funcionario"> | string
    dataAdmissao?: DateTimeFilter<"Funcionario"> | Date | string
    salarioBruto?: FloatFilter<"Funcionario"> | number
    pagamentoPorHora?: BoolFilter<"Funcionario"> | boolean
    horasSemana?: FloatFilter<"Funcionario"> | number
    diasTrabalho?: StringNullableListFilter<"Funcionario">
    iban?: StringNullableFilter<"Funcionario"> | string | null
    status?: StringFilter<"Funcionario"> | string
    observacoes?: StringNullableFilter<"Funcionario"> | string | null
    contratoUploadUrl?: StringNullableFilter<"Funcionario"> | string | null
    dataCriacao?: DateTimeFilter<"Funcionario"> | Date | string
    dataAtualizacao?: DateTimeFilter<"Funcionario"> | Date | string
    controleJornada?: ControleJornadaListRelationFilter
    resumoPagamento?: ResumoPagamentoListRelationFilter
  }, "id">

  export type FuncionarioOrderByWithAggregationInput = {
    id?: SortOrder
    nome?: SortOrder
    cargo?: SortOrder
    tipoContrato?: SortOrder
    dataAdmissao?: SortOrder
    salarioBruto?: SortOrder
    pagamentoPorHora?: SortOrder
    horasSemana?: SortOrder
    diasTrabalho?: SortOrder
    iban?: SortOrderInput | SortOrder
    status?: SortOrder
    observacoes?: SortOrderInput | SortOrder
    contratoUploadUrl?: SortOrderInput | SortOrder
    dataCriacao?: SortOrder
    dataAtualizacao?: SortOrder
    _count?: FuncionarioCountOrderByAggregateInput
    _avg?: FuncionarioAvgOrderByAggregateInput
    _max?: FuncionarioMaxOrderByAggregateInput
    _min?: FuncionarioMinOrderByAggregateInput
    _sum?: FuncionarioSumOrderByAggregateInput
  }

  export type FuncionarioScalarWhereWithAggregatesInput = {
    AND?: FuncionarioScalarWhereWithAggregatesInput | FuncionarioScalarWhereWithAggregatesInput[]
    OR?: FuncionarioScalarWhereWithAggregatesInput[]
    NOT?: FuncionarioScalarWhereWithAggregatesInput | FuncionarioScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Funcionario"> | string
    nome?: StringWithAggregatesFilter<"Funcionario"> | string
    cargo?: StringWithAggregatesFilter<"Funcionario"> | string
    tipoContrato?: StringWithAggregatesFilter<"Funcionario"> | string
    dataAdmissao?: DateTimeWithAggregatesFilter<"Funcionario"> | Date | string
    salarioBruto?: FloatWithAggregatesFilter<"Funcionario"> | number
    pagamentoPorHora?: BoolWithAggregatesFilter<"Funcionario"> | boolean
    horasSemana?: FloatWithAggregatesFilter<"Funcionario"> | number
    diasTrabalho?: StringNullableListFilter<"Funcionario">
    iban?: StringNullableWithAggregatesFilter<"Funcionario"> | string | null
    status?: StringWithAggregatesFilter<"Funcionario"> | string
    observacoes?: StringNullableWithAggregatesFilter<"Funcionario"> | string | null
    contratoUploadUrl?: StringNullableWithAggregatesFilter<"Funcionario"> | string | null
    dataCriacao?: DateTimeWithAggregatesFilter<"Funcionario"> | Date | string
    dataAtualizacao?: DateTimeWithAggregatesFilter<"Funcionario"> | Date | string
  }

  export type ControleJornadaWhereInput = {
    AND?: ControleJornadaWhereInput | ControleJornadaWhereInput[]
    OR?: ControleJornadaWhereInput[]
    NOT?: ControleJornadaWhereInput | ControleJornadaWhereInput[]
    id?: StringFilter<"ControleJornada"> | string
    funcionarioId?: StringFilter<"ControleJornada"> | string
    data?: DateTimeFilter<"ControleJornada"> | Date | string
    horaEntrada?: StringFilter<"ControleJornada"> | string
    horaSaida?: StringFilter<"ControleJornada"> | string
    horasTrabalhadas?: FloatFilter<"ControleJornada"> | number
    horaExtra?: FloatNullableFilter<"ControleJornada"> | number | null
    faltaJustificada?: BoolFilter<"ControleJornada"> | boolean
    observacoes?: StringNullableFilter<"ControleJornada"> | string | null
    dataCriacao?: DateTimeFilter<"ControleJornada"> | Date | string
    dataAtualizacao?: DateTimeFilter<"ControleJornada"> | Date | string
    funcionario?: XOR<FuncionarioScalarRelationFilter, FuncionarioWhereInput>
  }

  export type ControleJornadaOrderByWithRelationInput = {
    id?: SortOrder
    funcionarioId?: SortOrder
    data?: SortOrder
    horaEntrada?: SortOrder
    horaSaida?: SortOrder
    horasTrabalhadas?: SortOrder
    horaExtra?: SortOrderInput | SortOrder
    faltaJustificada?: SortOrder
    observacoes?: SortOrderInput | SortOrder
    dataCriacao?: SortOrder
    dataAtualizacao?: SortOrder
    funcionario?: FuncionarioOrderByWithRelationInput
  }

  export type ControleJornadaWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ControleJornadaWhereInput | ControleJornadaWhereInput[]
    OR?: ControleJornadaWhereInput[]
    NOT?: ControleJornadaWhereInput | ControleJornadaWhereInput[]
    funcionarioId?: StringFilter<"ControleJornada"> | string
    data?: DateTimeFilter<"ControleJornada"> | Date | string
    horaEntrada?: StringFilter<"ControleJornada"> | string
    horaSaida?: StringFilter<"ControleJornada"> | string
    horasTrabalhadas?: FloatFilter<"ControleJornada"> | number
    horaExtra?: FloatNullableFilter<"ControleJornada"> | number | null
    faltaJustificada?: BoolFilter<"ControleJornada"> | boolean
    observacoes?: StringNullableFilter<"ControleJornada"> | string | null
    dataCriacao?: DateTimeFilter<"ControleJornada"> | Date | string
    dataAtualizacao?: DateTimeFilter<"ControleJornada"> | Date | string
    funcionario?: XOR<FuncionarioScalarRelationFilter, FuncionarioWhereInput>
  }, "id">

  export type ControleJornadaOrderByWithAggregationInput = {
    id?: SortOrder
    funcionarioId?: SortOrder
    data?: SortOrder
    horaEntrada?: SortOrder
    horaSaida?: SortOrder
    horasTrabalhadas?: SortOrder
    horaExtra?: SortOrderInput | SortOrder
    faltaJustificada?: SortOrder
    observacoes?: SortOrderInput | SortOrder
    dataCriacao?: SortOrder
    dataAtualizacao?: SortOrder
    _count?: ControleJornadaCountOrderByAggregateInput
    _avg?: ControleJornadaAvgOrderByAggregateInput
    _max?: ControleJornadaMaxOrderByAggregateInput
    _min?: ControleJornadaMinOrderByAggregateInput
    _sum?: ControleJornadaSumOrderByAggregateInput
  }

  export type ControleJornadaScalarWhereWithAggregatesInput = {
    AND?: ControleJornadaScalarWhereWithAggregatesInput | ControleJornadaScalarWhereWithAggregatesInput[]
    OR?: ControleJornadaScalarWhereWithAggregatesInput[]
    NOT?: ControleJornadaScalarWhereWithAggregatesInput | ControleJornadaScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ControleJornada"> | string
    funcionarioId?: StringWithAggregatesFilter<"ControleJornada"> | string
    data?: DateTimeWithAggregatesFilter<"ControleJornada"> | Date | string
    horaEntrada?: StringWithAggregatesFilter<"ControleJornada"> | string
    horaSaida?: StringWithAggregatesFilter<"ControleJornada"> | string
    horasTrabalhadas?: FloatWithAggregatesFilter<"ControleJornada"> | number
    horaExtra?: FloatNullableWithAggregatesFilter<"ControleJornada"> | number | null
    faltaJustificada?: BoolWithAggregatesFilter<"ControleJornada"> | boolean
    observacoes?: StringNullableWithAggregatesFilter<"ControleJornada"> | string | null
    dataCriacao?: DateTimeWithAggregatesFilter<"ControleJornada"> | Date | string
    dataAtualizacao?: DateTimeWithAggregatesFilter<"ControleJornada"> | Date | string
  }

  export type ResumoPagamentoWhereInput = {
    AND?: ResumoPagamentoWhereInput | ResumoPagamentoWhereInput[]
    OR?: ResumoPagamentoWhereInput[]
    NOT?: ResumoPagamentoWhereInput | ResumoPagamentoWhereInput[]
    id?: StringFilter<"ResumoPagamento"> | string
    funcionarioId?: StringFilter<"ResumoPagamento"> | string
    mes?: StringFilter<"ResumoPagamento"> | string
    salarioPrevisto?: FloatFilter<"ResumoPagamento"> | number
    salarioReal?: FloatFilter<"ResumoPagamento"> | number
    extras?: FloatNullableFilter<"ResumoPagamento"> | number | null
    descontos?: FloatNullableFilter<"ResumoPagamento"> | number | null
    observacoes?: StringNullableFilter<"ResumoPagamento"> | string | null
    enviadoParaContador?: BoolFilter<"ResumoPagamento"> | boolean
    dataCriacao?: DateTimeFilter<"ResumoPagamento"> | Date | string
    dataAtualizacao?: DateTimeFilter<"ResumoPagamento"> | Date | string
    funcionario?: XOR<FuncionarioScalarRelationFilter, FuncionarioWhereInput>
  }

  export type ResumoPagamentoOrderByWithRelationInput = {
    id?: SortOrder
    funcionarioId?: SortOrder
    mes?: SortOrder
    salarioPrevisto?: SortOrder
    salarioReal?: SortOrder
    extras?: SortOrderInput | SortOrder
    descontos?: SortOrderInput | SortOrder
    observacoes?: SortOrderInput | SortOrder
    enviadoParaContador?: SortOrder
    dataCriacao?: SortOrder
    dataAtualizacao?: SortOrder
    funcionario?: FuncionarioOrderByWithRelationInput
  }

  export type ResumoPagamentoWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ResumoPagamentoWhereInput | ResumoPagamentoWhereInput[]
    OR?: ResumoPagamentoWhereInput[]
    NOT?: ResumoPagamentoWhereInput | ResumoPagamentoWhereInput[]
    funcionarioId?: StringFilter<"ResumoPagamento"> | string
    mes?: StringFilter<"ResumoPagamento"> | string
    salarioPrevisto?: FloatFilter<"ResumoPagamento"> | number
    salarioReal?: FloatFilter<"ResumoPagamento"> | number
    extras?: FloatNullableFilter<"ResumoPagamento"> | number | null
    descontos?: FloatNullableFilter<"ResumoPagamento"> | number | null
    observacoes?: StringNullableFilter<"ResumoPagamento"> | string | null
    enviadoParaContador?: BoolFilter<"ResumoPagamento"> | boolean
    dataCriacao?: DateTimeFilter<"ResumoPagamento"> | Date | string
    dataAtualizacao?: DateTimeFilter<"ResumoPagamento"> | Date | string
    funcionario?: XOR<FuncionarioScalarRelationFilter, FuncionarioWhereInput>
  }, "id">

  export type ResumoPagamentoOrderByWithAggregationInput = {
    id?: SortOrder
    funcionarioId?: SortOrder
    mes?: SortOrder
    salarioPrevisto?: SortOrder
    salarioReal?: SortOrder
    extras?: SortOrderInput | SortOrder
    descontos?: SortOrderInput | SortOrder
    observacoes?: SortOrderInput | SortOrder
    enviadoParaContador?: SortOrder
    dataCriacao?: SortOrder
    dataAtualizacao?: SortOrder
    _count?: ResumoPagamentoCountOrderByAggregateInput
    _avg?: ResumoPagamentoAvgOrderByAggregateInput
    _max?: ResumoPagamentoMaxOrderByAggregateInput
    _min?: ResumoPagamentoMinOrderByAggregateInput
    _sum?: ResumoPagamentoSumOrderByAggregateInput
  }

  export type ResumoPagamentoScalarWhereWithAggregatesInput = {
    AND?: ResumoPagamentoScalarWhereWithAggregatesInput | ResumoPagamentoScalarWhereWithAggregatesInput[]
    OR?: ResumoPagamentoScalarWhereWithAggregatesInput[]
    NOT?: ResumoPagamentoScalarWhereWithAggregatesInput | ResumoPagamentoScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ResumoPagamento"> | string
    funcionarioId?: StringWithAggregatesFilter<"ResumoPagamento"> | string
    mes?: StringWithAggregatesFilter<"ResumoPagamento"> | string
    salarioPrevisto?: FloatWithAggregatesFilter<"ResumoPagamento"> | number
    salarioReal?: FloatWithAggregatesFilter<"ResumoPagamento"> | number
    extras?: FloatNullableWithAggregatesFilter<"ResumoPagamento"> | number | null
    descontos?: FloatNullableWithAggregatesFilter<"ResumoPagamento"> | number | null
    observacoes?: StringNullableWithAggregatesFilter<"ResumoPagamento"> | string | null
    enviadoParaContador?: BoolWithAggregatesFilter<"ResumoPagamento"> | boolean
    dataCriacao?: DateTimeWithAggregatesFilter<"ResumoPagamento"> | Date | string
    dataAtualizacao?: DateTimeWithAggregatesFilter<"ResumoPagamento"> | Date | string
  }

  export type UserCreateInput = {
    id?: string
    nome: string
    email: string
    cargo?: string | null
    telefone?: string | null
    setor?: string | null
    password: string
    permissoes?: string
    tipoNegocio?: string | null
    numeroFuncionarios?: number | null
    passwordResetToken?: string | null
    passwordResetExpires?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    pagamentos?: PagamentoCreateNestedManyWithoutUserInput
    inventario?: InventarioCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateInput = {
    id?: string
    nome: string
    email: string
    cargo?: string | null
    telefone?: string | null
    setor?: string | null
    password: string
    permissoes?: string
    tipoNegocio?: string | null
    numeroFuncionarios?: number | null
    passwordResetToken?: string | null
    passwordResetExpires?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    pagamentos?: PagamentoUncheckedCreateNestedManyWithoutUserInput
    inventario?: InventarioUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    cargo?: NullableStringFieldUpdateOperationsInput | string | null
    telefone?: NullableStringFieldUpdateOperationsInput | string | null
    setor?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    permissoes?: StringFieldUpdateOperationsInput | string
    tipoNegocio?: NullableStringFieldUpdateOperationsInput | string | null
    numeroFuncionarios?: NullableIntFieldUpdateOperationsInput | number | null
    passwordResetToken?: NullableStringFieldUpdateOperationsInput | string | null
    passwordResetExpires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    pagamentos?: PagamentoUpdateManyWithoutUserNestedInput
    inventario?: InventarioUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    cargo?: NullableStringFieldUpdateOperationsInput | string | null
    telefone?: NullableStringFieldUpdateOperationsInput | string | null
    setor?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    permissoes?: StringFieldUpdateOperationsInput | string
    tipoNegocio?: NullableStringFieldUpdateOperationsInput | string | null
    numeroFuncionarios?: NullableIntFieldUpdateOperationsInput | number | null
    passwordResetToken?: NullableStringFieldUpdateOperationsInput | string | null
    passwordResetExpires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    pagamentos?: PagamentoUncheckedUpdateManyWithoutUserNestedInput
    inventario?: InventarioUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateManyInput = {
    id?: string
    nome: string
    email: string
    cargo?: string | null
    telefone?: string | null
    setor?: string | null
    password: string
    permissoes?: string
    tipoNegocio?: string | null
    numeroFuncionarios?: number | null
    passwordResetToken?: string | null
    passwordResetExpires?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    cargo?: NullableStringFieldUpdateOperationsInput | string | null
    telefone?: NullableStringFieldUpdateOperationsInput | string | null
    setor?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    permissoes?: StringFieldUpdateOperationsInput | string
    tipoNegocio?: NullableStringFieldUpdateOperationsInput | string | null
    numeroFuncionarios?: NullableIntFieldUpdateOperationsInput | number | null
    passwordResetToken?: NullableStringFieldUpdateOperationsInput | string | null
    passwordResetExpires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    cargo?: NullableStringFieldUpdateOperationsInput | string | null
    telefone?: NullableStringFieldUpdateOperationsInput | string | null
    setor?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    permissoes?: StringFieldUpdateOperationsInput | string
    tipoNegocio?: NullableStringFieldUpdateOperationsInput | string | null
    numeroFuncionarios?: NullableIntFieldUpdateOperationsInput | number | null
    passwordResetToken?: NullableStringFieldUpdateOperationsInput | string | null
    passwordResetExpires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PagamentoCreateInput = {
    id?: string
    valor: number
    data: Date | string
    status: string
    descricao?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutPagamentosInput
  }

  export type PagamentoUncheckedCreateInput = {
    id?: string
    valor: number
    data: Date | string
    status: string
    descricao?: string | null
    userId: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PagamentoUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    valor?: FloatFieldUpdateOperationsInput | number
    data?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
    descricao?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutPagamentosNestedInput
  }

  export type PagamentoUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    valor?: FloatFieldUpdateOperationsInput | number
    data?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
    descricao?: NullableStringFieldUpdateOperationsInput | string | null
    userId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PagamentoCreateManyInput = {
    id?: string
    valor: number
    data: Date | string
    status: string
    descricao?: string | null
    userId: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PagamentoUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    valor?: FloatFieldUpdateOperationsInput | number
    data?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
    descricao?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PagamentoUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    valor?: FloatFieldUpdateOperationsInput | number
    data?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
    descricao?: NullableStringFieldUpdateOperationsInput | string | null
    userId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InventarioCreateInput = {
    id?: string
    nome: string
    quantidade: number
    preco: number
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutInventarioInput
  }

  export type InventarioUncheckedCreateInput = {
    id?: string
    nome: string
    quantidade: number
    preco: number
    userId: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type InventarioUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    quantidade?: IntFieldUpdateOperationsInput | number
    preco?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutInventarioNestedInput
  }

  export type InventarioUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    quantidade?: IntFieldUpdateOperationsInput | number
    preco?: FloatFieldUpdateOperationsInput | number
    userId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InventarioCreateManyInput = {
    id?: string
    nome: string
    quantidade: number
    preco: number
    userId: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type InventarioUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    quantidade?: IntFieldUpdateOperationsInput | number
    preco?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InventarioUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    quantidade?: IntFieldUpdateOperationsInput | number
    preco?: FloatFieldUpdateOperationsInput | number
    userId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FuncionarioCreateInput = {
    id?: string
    nome: string
    cargo: string
    tipoContrato: string
    dataAdmissao: Date | string
    salarioBruto: number
    pagamentoPorHora: boolean
    horasSemana: number
    diasTrabalho?: FuncionarioCreatediasTrabalhoInput | string[]
    iban?: string | null
    status: string
    observacoes?: string | null
    contratoUploadUrl?: string | null
    dataCriacao?: Date | string
    dataAtualizacao?: Date | string
    controleJornada?: ControleJornadaCreateNestedManyWithoutFuncionarioInput
    resumoPagamento?: ResumoPagamentoCreateNestedManyWithoutFuncionarioInput
  }

  export type FuncionarioUncheckedCreateInput = {
    id?: string
    nome: string
    cargo: string
    tipoContrato: string
    dataAdmissao: Date | string
    salarioBruto: number
    pagamentoPorHora: boolean
    horasSemana: number
    diasTrabalho?: FuncionarioCreatediasTrabalhoInput | string[]
    iban?: string | null
    status: string
    observacoes?: string | null
    contratoUploadUrl?: string | null
    dataCriacao?: Date | string
    dataAtualizacao?: Date | string
    controleJornada?: ControleJornadaUncheckedCreateNestedManyWithoutFuncionarioInput
    resumoPagamento?: ResumoPagamentoUncheckedCreateNestedManyWithoutFuncionarioInput
  }

  export type FuncionarioUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    cargo?: StringFieldUpdateOperationsInput | string
    tipoContrato?: StringFieldUpdateOperationsInput | string
    dataAdmissao?: DateTimeFieldUpdateOperationsInput | Date | string
    salarioBruto?: FloatFieldUpdateOperationsInput | number
    pagamentoPorHora?: BoolFieldUpdateOperationsInput | boolean
    horasSemana?: FloatFieldUpdateOperationsInput | number
    diasTrabalho?: FuncionarioUpdatediasTrabalhoInput | string[]
    iban?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    observacoes?: NullableStringFieldUpdateOperationsInput | string | null
    contratoUploadUrl?: NullableStringFieldUpdateOperationsInput | string | null
    dataCriacao?: DateTimeFieldUpdateOperationsInput | Date | string
    dataAtualizacao?: DateTimeFieldUpdateOperationsInput | Date | string
    controleJornada?: ControleJornadaUpdateManyWithoutFuncionarioNestedInput
    resumoPagamento?: ResumoPagamentoUpdateManyWithoutFuncionarioNestedInput
  }

  export type FuncionarioUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    cargo?: StringFieldUpdateOperationsInput | string
    tipoContrato?: StringFieldUpdateOperationsInput | string
    dataAdmissao?: DateTimeFieldUpdateOperationsInput | Date | string
    salarioBruto?: FloatFieldUpdateOperationsInput | number
    pagamentoPorHora?: BoolFieldUpdateOperationsInput | boolean
    horasSemana?: FloatFieldUpdateOperationsInput | number
    diasTrabalho?: FuncionarioUpdatediasTrabalhoInput | string[]
    iban?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    observacoes?: NullableStringFieldUpdateOperationsInput | string | null
    contratoUploadUrl?: NullableStringFieldUpdateOperationsInput | string | null
    dataCriacao?: DateTimeFieldUpdateOperationsInput | Date | string
    dataAtualizacao?: DateTimeFieldUpdateOperationsInput | Date | string
    controleJornada?: ControleJornadaUncheckedUpdateManyWithoutFuncionarioNestedInput
    resumoPagamento?: ResumoPagamentoUncheckedUpdateManyWithoutFuncionarioNestedInput
  }

  export type FuncionarioCreateManyInput = {
    id?: string
    nome: string
    cargo: string
    tipoContrato: string
    dataAdmissao: Date | string
    salarioBruto: number
    pagamentoPorHora: boolean
    horasSemana: number
    diasTrabalho?: FuncionarioCreatediasTrabalhoInput | string[]
    iban?: string | null
    status: string
    observacoes?: string | null
    contratoUploadUrl?: string | null
    dataCriacao?: Date | string
    dataAtualizacao?: Date | string
  }

  export type FuncionarioUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    cargo?: StringFieldUpdateOperationsInput | string
    tipoContrato?: StringFieldUpdateOperationsInput | string
    dataAdmissao?: DateTimeFieldUpdateOperationsInput | Date | string
    salarioBruto?: FloatFieldUpdateOperationsInput | number
    pagamentoPorHora?: BoolFieldUpdateOperationsInput | boolean
    horasSemana?: FloatFieldUpdateOperationsInput | number
    diasTrabalho?: FuncionarioUpdatediasTrabalhoInput | string[]
    iban?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    observacoes?: NullableStringFieldUpdateOperationsInput | string | null
    contratoUploadUrl?: NullableStringFieldUpdateOperationsInput | string | null
    dataCriacao?: DateTimeFieldUpdateOperationsInput | Date | string
    dataAtualizacao?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FuncionarioUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    cargo?: StringFieldUpdateOperationsInput | string
    tipoContrato?: StringFieldUpdateOperationsInput | string
    dataAdmissao?: DateTimeFieldUpdateOperationsInput | Date | string
    salarioBruto?: FloatFieldUpdateOperationsInput | number
    pagamentoPorHora?: BoolFieldUpdateOperationsInput | boolean
    horasSemana?: FloatFieldUpdateOperationsInput | number
    diasTrabalho?: FuncionarioUpdatediasTrabalhoInput | string[]
    iban?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    observacoes?: NullableStringFieldUpdateOperationsInput | string | null
    contratoUploadUrl?: NullableStringFieldUpdateOperationsInput | string | null
    dataCriacao?: DateTimeFieldUpdateOperationsInput | Date | string
    dataAtualizacao?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ControleJornadaCreateInput = {
    id?: string
    data: Date | string
    horaEntrada: string
    horaSaida: string
    horasTrabalhadas: number
    horaExtra?: number | null
    faltaJustificada: boolean
    observacoes?: string | null
    dataCriacao?: Date | string
    dataAtualizacao?: Date | string
    funcionario: FuncionarioCreateNestedOneWithoutControleJornadaInput
  }

  export type ControleJornadaUncheckedCreateInput = {
    id?: string
    funcionarioId: string
    data: Date | string
    horaEntrada: string
    horaSaida: string
    horasTrabalhadas: number
    horaExtra?: number | null
    faltaJustificada: boolean
    observacoes?: string | null
    dataCriacao?: Date | string
    dataAtualizacao?: Date | string
  }

  export type ControleJornadaUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    data?: DateTimeFieldUpdateOperationsInput | Date | string
    horaEntrada?: StringFieldUpdateOperationsInput | string
    horaSaida?: StringFieldUpdateOperationsInput | string
    horasTrabalhadas?: FloatFieldUpdateOperationsInput | number
    horaExtra?: NullableFloatFieldUpdateOperationsInput | number | null
    faltaJustificada?: BoolFieldUpdateOperationsInput | boolean
    observacoes?: NullableStringFieldUpdateOperationsInput | string | null
    dataCriacao?: DateTimeFieldUpdateOperationsInput | Date | string
    dataAtualizacao?: DateTimeFieldUpdateOperationsInput | Date | string
    funcionario?: FuncionarioUpdateOneRequiredWithoutControleJornadaNestedInput
  }

  export type ControleJornadaUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    funcionarioId?: StringFieldUpdateOperationsInput | string
    data?: DateTimeFieldUpdateOperationsInput | Date | string
    horaEntrada?: StringFieldUpdateOperationsInput | string
    horaSaida?: StringFieldUpdateOperationsInput | string
    horasTrabalhadas?: FloatFieldUpdateOperationsInput | number
    horaExtra?: NullableFloatFieldUpdateOperationsInput | number | null
    faltaJustificada?: BoolFieldUpdateOperationsInput | boolean
    observacoes?: NullableStringFieldUpdateOperationsInput | string | null
    dataCriacao?: DateTimeFieldUpdateOperationsInput | Date | string
    dataAtualizacao?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ControleJornadaCreateManyInput = {
    id?: string
    funcionarioId: string
    data: Date | string
    horaEntrada: string
    horaSaida: string
    horasTrabalhadas: number
    horaExtra?: number | null
    faltaJustificada: boolean
    observacoes?: string | null
    dataCriacao?: Date | string
    dataAtualizacao?: Date | string
  }

  export type ControleJornadaUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    data?: DateTimeFieldUpdateOperationsInput | Date | string
    horaEntrada?: StringFieldUpdateOperationsInput | string
    horaSaida?: StringFieldUpdateOperationsInput | string
    horasTrabalhadas?: FloatFieldUpdateOperationsInput | number
    horaExtra?: NullableFloatFieldUpdateOperationsInput | number | null
    faltaJustificada?: BoolFieldUpdateOperationsInput | boolean
    observacoes?: NullableStringFieldUpdateOperationsInput | string | null
    dataCriacao?: DateTimeFieldUpdateOperationsInput | Date | string
    dataAtualizacao?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ControleJornadaUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    funcionarioId?: StringFieldUpdateOperationsInput | string
    data?: DateTimeFieldUpdateOperationsInput | Date | string
    horaEntrada?: StringFieldUpdateOperationsInput | string
    horaSaida?: StringFieldUpdateOperationsInput | string
    horasTrabalhadas?: FloatFieldUpdateOperationsInput | number
    horaExtra?: NullableFloatFieldUpdateOperationsInput | number | null
    faltaJustificada?: BoolFieldUpdateOperationsInput | boolean
    observacoes?: NullableStringFieldUpdateOperationsInput | string | null
    dataCriacao?: DateTimeFieldUpdateOperationsInput | Date | string
    dataAtualizacao?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ResumoPagamentoCreateInput = {
    id?: string
    mes: string
    salarioPrevisto: number
    salarioReal: number
    extras?: number | null
    descontos?: number | null
    observacoes?: string | null
    enviadoParaContador?: boolean
    dataCriacao?: Date | string
    dataAtualizacao?: Date | string
    funcionario: FuncionarioCreateNestedOneWithoutResumoPagamentoInput
  }

  export type ResumoPagamentoUncheckedCreateInput = {
    id?: string
    funcionarioId: string
    mes: string
    salarioPrevisto: number
    salarioReal: number
    extras?: number | null
    descontos?: number | null
    observacoes?: string | null
    enviadoParaContador?: boolean
    dataCriacao?: Date | string
    dataAtualizacao?: Date | string
  }

  export type ResumoPagamentoUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    mes?: StringFieldUpdateOperationsInput | string
    salarioPrevisto?: FloatFieldUpdateOperationsInput | number
    salarioReal?: FloatFieldUpdateOperationsInput | number
    extras?: NullableFloatFieldUpdateOperationsInput | number | null
    descontos?: NullableFloatFieldUpdateOperationsInput | number | null
    observacoes?: NullableStringFieldUpdateOperationsInput | string | null
    enviadoParaContador?: BoolFieldUpdateOperationsInput | boolean
    dataCriacao?: DateTimeFieldUpdateOperationsInput | Date | string
    dataAtualizacao?: DateTimeFieldUpdateOperationsInput | Date | string
    funcionario?: FuncionarioUpdateOneRequiredWithoutResumoPagamentoNestedInput
  }

  export type ResumoPagamentoUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    funcionarioId?: StringFieldUpdateOperationsInput | string
    mes?: StringFieldUpdateOperationsInput | string
    salarioPrevisto?: FloatFieldUpdateOperationsInput | number
    salarioReal?: FloatFieldUpdateOperationsInput | number
    extras?: NullableFloatFieldUpdateOperationsInput | number | null
    descontos?: NullableFloatFieldUpdateOperationsInput | number | null
    observacoes?: NullableStringFieldUpdateOperationsInput | string | null
    enviadoParaContador?: BoolFieldUpdateOperationsInput | boolean
    dataCriacao?: DateTimeFieldUpdateOperationsInput | Date | string
    dataAtualizacao?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ResumoPagamentoCreateManyInput = {
    id?: string
    funcionarioId: string
    mes: string
    salarioPrevisto: number
    salarioReal: number
    extras?: number | null
    descontos?: number | null
    observacoes?: string | null
    enviadoParaContador?: boolean
    dataCriacao?: Date | string
    dataAtualizacao?: Date | string
  }

  export type ResumoPagamentoUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    mes?: StringFieldUpdateOperationsInput | string
    salarioPrevisto?: FloatFieldUpdateOperationsInput | number
    salarioReal?: FloatFieldUpdateOperationsInput | number
    extras?: NullableFloatFieldUpdateOperationsInput | number | null
    descontos?: NullableFloatFieldUpdateOperationsInput | number | null
    observacoes?: NullableStringFieldUpdateOperationsInput | string | null
    enviadoParaContador?: BoolFieldUpdateOperationsInput | boolean
    dataCriacao?: DateTimeFieldUpdateOperationsInput | Date | string
    dataAtualizacao?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ResumoPagamentoUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    funcionarioId?: StringFieldUpdateOperationsInput | string
    mes?: StringFieldUpdateOperationsInput | string
    salarioPrevisto?: FloatFieldUpdateOperationsInput | number
    salarioReal?: FloatFieldUpdateOperationsInput | number
    extras?: NullableFloatFieldUpdateOperationsInput | number | null
    descontos?: NullableFloatFieldUpdateOperationsInput | number | null
    observacoes?: NullableStringFieldUpdateOperationsInput | string | null
    enviadoParaContador?: BoolFieldUpdateOperationsInput | boolean
    dataCriacao?: DateTimeFieldUpdateOperationsInput | Date | string
    dataAtualizacao?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type PagamentoListRelationFilter = {
    every?: PagamentoWhereInput
    some?: PagamentoWhereInput
    none?: PagamentoWhereInput
  }

  export type InventarioListRelationFilter = {
    every?: InventarioWhereInput
    some?: InventarioWhereInput
    none?: InventarioWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type PagamentoOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type InventarioOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    nome?: SortOrder
    email?: SortOrder
    cargo?: SortOrder
    telefone?: SortOrder
    setor?: SortOrder
    password?: SortOrder
    permissoes?: SortOrder
    tipoNegocio?: SortOrder
    numeroFuncionarios?: SortOrder
    passwordResetToken?: SortOrder
    passwordResetExpires?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserAvgOrderByAggregateInput = {
    numeroFuncionarios?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    nome?: SortOrder
    email?: SortOrder
    cargo?: SortOrder
    telefone?: SortOrder
    setor?: SortOrder
    password?: SortOrder
    permissoes?: SortOrder
    tipoNegocio?: SortOrder
    numeroFuncionarios?: SortOrder
    passwordResetToken?: SortOrder
    passwordResetExpires?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    nome?: SortOrder
    email?: SortOrder
    cargo?: SortOrder
    telefone?: SortOrder
    setor?: SortOrder
    password?: SortOrder
    permissoes?: SortOrder
    tipoNegocio?: SortOrder
    numeroFuncionarios?: SortOrder
    passwordResetToken?: SortOrder
    passwordResetExpires?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserSumOrderByAggregateInput = {
    numeroFuncionarios?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type FloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type UserScalarRelationFilter = {
    is?: UserWhereInput
    isNot?: UserWhereInput
  }

  export type PagamentoCountOrderByAggregateInput = {
    id?: SortOrder
    valor?: SortOrder
    data?: SortOrder
    status?: SortOrder
    descricao?: SortOrder
    userId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PagamentoAvgOrderByAggregateInput = {
    valor?: SortOrder
  }

  export type PagamentoMaxOrderByAggregateInput = {
    id?: SortOrder
    valor?: SortOrder
    data?: SortOrder
    status?: SortOrder
    descricao?: SortOrder
    userId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PagamentoMinOrderByAggregateInput = {
    id?: SortOrder
    valor?: SortOrder
    data?: SortOrder
    status?: SortOrder
    descricao?: SortOrder
    userId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PagamentoSumOrderByAggregateInput = {
    valor?: SortOrder
  }

  export type FloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type InventarioCountOrderByAggregateInput = {
    id?: SortOrder
    nome?: SortOrder
    quantidade?: SortOrder
    preco?: SortOrder
    userId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type InventarioAvgOrderByAggregateInput = {
    quantidade?: SortOrder
    preco?: SortOrder
  }

  export type InventarioMaxOrderByAggregateInput = {
    id?: SortOrder
    nome?: SortOrder
    quantidade?: SortOrder
    preco?: SortOrder
    userId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type InventarioMinOrderByAggregateInput = {
    id?: SortOrder
    nome?: SortOrder
    quantidade?: SortOrder
    preco?: SortOrder
    userId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type InventarioSumOrderByAggregateInput = {
    quantidade?: SortOrder
    preco?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type StringNullableListFilter<$PrismaModel = never> = {
    equals?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    has?: string | StringFieldRefInput<$PrismaModel> | null
    hasEvery?: string[] | ListStringFieldRefInput<$PrismaModel>
    hasSome?: string[] | ListStringFieldRefInput<$PrismaModel>
    isEmpty?: boolean
  }

  export type ControleJornadaListRelationFilter = {
    every?: ControleJornadaWhereInput
    some?: ControleJornadaWhereInput
    none?: ControleJornadaWhereInput
  }

  export type ResumoPagamentoListRelationFilter = {
    every?: ResumoPagamentoWhereInput
    some?: ResumoPagamentoWhereInput
    none?: ResumoPagamentoWhereInput
  }

  export type ControleJornadaOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ResumoPagamentoOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type FuncionarioCountOrderByAggregateInput = {
    id?: SortOrder
    nome?: SortOrder
    cargo?: SortOrder
    tipoContrato?: SortOrder
    dataAdmissao?: SortOrder
    salarioBruto?: SortOrder
    pagamentoPorHora?: SortOrder
    horasSemana?: SortOrder
    diasTrabalho?: SortOrder
    iban?: SortOrder
    status?: SortOrder
    observacoes?: SortOrder
    contratoUploadUrl?: SortOrder
    dataCriacao?: SortOrder
    dataAtualizacao?: SortOrder
  }

  export type FuncionarioAvgOrderByAggregateInput = {
    salarioBruto?: SortOrder
    horasSemana?: SortOrder
  }

  export type FuncionarioMaxOrderByAggregateInput = {
    id?: SortOrder
    nome?: SortOrder
    cargo?: SortOrder
    tipoContrato?: SortOrder
    dataAdmissao?: SortOrder
    salarioBruto?: SortOrder
    pagamentoPorHora?: SortOrder
    horasSemana?: SortOrder
    iban?: SortOrder
    status?: SortOrder
    observacoes?: SortOrder
    contratoUploadUrl?: SortOrder
    dataCriacao?: SortOrder
    dataAtualizacao?: SortOrder
  }

  export type FuncionarioMinOrderByAggregateInput = {
    id?: SortOrder
    nome?: SortOrder
    cargo?: SortOrder
    tipoContrato?: SortOrder
    dataAdmissao?: SortOrder
    salarioBruto?: SortOrder
    pagamentoPorHora?: SortOrder
    horasSemana?: SortOrder
    iban?: SortOrder
    status?: SortOrder
    observacoes?: SortOrder
    contratoUploadUrl?: SortOrder
    dataCriacao?: SortOrder
    dataAtualizacao?: SortOrder
  }

  export type FuncionarioSumOrderByAggregateInput = {
    salarioBruto?: SortOrder
    horasSemana?: SortOrder
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type FloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type FuncionarioScalarRelationFilter = {
    is?: FuncionarioWhereInput
    isNot?: FuncionarioWhereInput
  }

  export type ControleJornadaCountOrderByAggregateInput = {
    id?: SortOrder
    funcionarioId?: SortOrder
    data?: SortOrder
    horaEntrada?: SortOrder
    horaSaida?: SortOrder
    horasTrabalhadas?: SortOrder
    horaExtra?: SortOrder
    faltaJustificada?: SortOrder
    observacoes?: SortOrder
    dataCriacao?: SortOrder
    dataAtualizacao?: SortOrder
  }

  export type ControleJornadaAvgOrderByAggregateInput = {
    horasTrabalhadas?: SortOrder
    horaExtra?: SortOrder
  }

  export type ControleJornadaMaxOrderByAggregateInput = {
    id?: SortOrder
    funcionarioId?: SortOrder
    data?: SortOrder
    horaEntrada?: SortOrder
    horaSaida?: SortOrder
    horasTrabalhadas?: SortOrder
    horaExtra?: SortOrder
    faltaJustificada?: SortOrder
    observacoes?: SortOrder
    dataCriacao?: SortOrder
    dataAtualizacao?: SortOrder
  }

  export type ControleJornadaMinOrderByAggregateInput = {
    id?: SortOrder
    funcionarioId?: SortOrder
    data?: SortOrder
    horaEntrada?: SortOrder
    horaSaida?: SortOrder
    horasTrabalhadas?: SortOrder
    horaExtra?: SortOrder
    faltaJustificada?: SortOrder
    observacoes?: SortOrder
    dataCriacao?: SortOrder
    dataAtualizacao?: SortOrder
  }

  export type ControleJornadaSumOrderByAggregateInput = {
    horasTrabalhadas?: SortOrder
    horaExtra?: SortOrder
  }

  export type FloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedFloatNullableFilter<$PrismaModel>
    _min?: NestedFloatNullableFilter<$PrismaModel>
    _max?: NestedFloatNullableFilter<$PrismaModel>
  }

  export type ResumoPagamentoCountOrderByAggregateInput = {
    id?: SortOrder
    funcionarioId?: SortOrder
    mes?: SortOrder
    salarioPrevisto?: SortOrder
    salarioReal?: SortOrder
    extras?: SortOrder
    descontos?: SortOrder
    observacoes?: SortOrder
    enviadoParaContador?: SortOrder
    dataCriacao?: SortOrder
    dataAtualizacao?: SortOrder
  }

  export type ResumoPagamentoAvgOrderByAggregateInput = {
    salarioPrevisto?: SortOrder
    salarioReal?: SortOrder
    extras?: SortOrder
    descontos?: SortOrder
  }

  export type ResumoPagamentoMaxOrderByAggregateInput = {
    id?: SortOrder
    funcionarioId?: SortOrder
    mes?: SortOrder
    salarioPrevisto?: SortOrder
    salarioReal?: SortOrder
    extras?: SortOrder
    descontos?: SortOrder
    observacoes?: SortOrder
    enviadoParaContador?: SortOrder
    dataCriacao?: SortOrder
    dataAtualizacao?: SortOrder
  }

  export type ResumoPagamentoMinOrderByAggregateInput = {
    id?: SortOrder
    funcionarioId?: SortOrder
    mes?: SortOrder
    salarioPrevisto?: SortOrder
    salarioReal?: SortOrder
    extras?: SortOrder
    descontos?: SortOrder
    observacoes?: SortOrder
    enviadoParaContador?: SortOrder
    dataCriacao?: SortOrder
    dataAtualizacao?: SortOrder
  }

  export type ResumoPagamentoSumOrderByAggregateInput = {
    salarioPrevisto?: SortOrder
    salarioReal?: SortOrder
    extras?: SortOrder
    descontos?: SortOrder
  }

  export type PagamentoCreateNestedManyWithoutUserInput = {
    create?: XOR<PagamentoCreateWithoutUserInput, PagamentoUncheckedCreateWithoutUserInput> | PagamentoCreateWithoutUserInput[] | PagamentoUncheckedCreateWithoutUserInput[]
    connectOrCreate?: PagamentoCreateOrConnectWithoutUserInput | PagamentoCreateOrConnectWithoutUserInput[]
    createMany?: PagamentoCreateManyUserInputEnvelope
    connect?: PagamentoWhereUniqueInput | PagamentoWhereUniqueInput[]
  }

  export type InventarioCreateNestedManyWithoutUserInput = {
    create?: XOR<InventarioCreateWithoutUserInput, InventarioUncheckedCreateWithoutUserInput> | InventarioCreateWithoutUserInput[] | InventarioUncheckedCreateWithoutUserInput[]
    connectOrCreate?: InventarioCreateOrConnectWithoutUserInput | InventarioCreateOrConnectWithoutUserInput[]
    createMany?: InventarioCreateManyUserInputEnvelope
    connect?: InventarioWhereUniqueInput | InventarioWhereUniqueInput[]
  }

  export type PagamentoUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<PagamentoCreateWithoutUserInput, PagamentoUncheckedCreateWithoutUserInput> | PagamentoCreateWithoutUserInput[] | PagamentoUncheckedCreateWithoutUserInput[]
    connectOrCreate?: PagamentoCreateOrConnectWithoutUserInput | PagamentoCreateOrConnectWithoutUserInput[]
    createMany?: PagamentoCreateManyUserInputEnvelope
    connect?: PagamentoWhereUniqueInput | PagamentoWhereUniqueInput[]
  }

  export type InventarioUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<InventarioCreateWithoutUserInput, InventarioUncheckedCreateWithoutUserInput> | InventarioCreateWithoutUserInput[] | InventarioUncheckedCreateWithoutUserInput[]
    connectOrCreate?: InventarioCreateOrConnectWithoutUserInput | InventarioCreateOrConnectWithoutUserInput[]
    createMany?: InventarioCreateManyUserInputEnvelope
    connect?: InventarioWhereUniqueInput | InventarioWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type PagamentoUpdateManyWithoutUserNestedInput = {
    create?: XOR<PagamentoCreateWithoutUserInput, PagamentoUncheckedCreateWithoutUserInput> | PagamentoCreateWithoutUserInput[] | PagamentoUncheckedCreateWithoutUserInput[]
    connectOrCreate?: PagamentoCreateOrConnectWithoutUserInput | PagamentoCreateOrConnectWithoutUserInput[]
    upsert?: PagamentoUpsertWithWhereUniqueWithoutUserInput | PagamentoUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: PagamentoCreateManyUserInputEnvelope
    set?: PagamentoWhereUniqueInput | PagamentoWhereUniqueInput[]
    disconnect?: PagamentoWhereUniqueInput | PagamentoWhereUniqueInput[]
    delete?: PagamentoWhereUniqueInput | PagamentoWhereUniqueInput[]
    connect?: PagamentoWhereUniqueInput | PagamentoWhereUniqueInput[]
    update?: PagamentoUpdateWithWhereUniqueWithoutUserInput | PagamentoUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: PagamentoUpdateManyWithWhereWithoutUserInput | PagamentoUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: PagamentoScalarWhereInput | PagamentoScalarWhereInput[]
  }

  export type InventarioUpdateManyWithoutUserNestedInput = {
    create?: XOR<InventarioCreateWithoutUserInput, InventarioUncheckedCreateWithoutUserInput> | InventarioCreateWithoutUserInput[] | InventarioUncheckedCreateWithoutUserInput[]
    connectOrCreate?: InventarioCreateOrConnectWithoutUserInput | InventarioCreateOrConnectWithoutUserInput[]
    upsert?: InventarioUpsertWithWhereUniqueWithoutUserInput | InventarioUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: InventarioCreateManyUserInputEnvelope
    set?: InventarioWhereUniqueInput | InventarioWhereUniqueInput[]
    disconnect?: InventarioWhereUniqueInput | InventarioWhereUniqueInput[]
    delete?: InventarioWhereUniqueInput | InventarioWhereUniqueInput[]
    connect?: InventarioWhereUniqueInput | InventarioWhereUniqueInput[]
    update?: InventarioUpdateWithWhereUniqueWithoutUserInput | InventarioUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: InventarioUpdateManyWithWhereWithoutUserInput | InventarioUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: InventarioScalarWhereInput | InventarioScalarWhereInput[]
  }

  export type PagamentoUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<PagamentoCreateWithoutUserInput, PagamentoUncheckedCreateWithoutUserInput> | PagamentoCreateWithoutUserInput[] | PagamentoUncheckedCreateWithoutUserInput[]
    connectOrCreate?: PagamentoCreateOrConnectWithoutUserInput | PagamentoCreateOrConnectWithoutUserInput[]
    upsert?: PagamentoUpsertWithWhereUniqueWithoutUserInput | PagamentoUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: PagamentoCreateManyUserInputEnvelope
    set?: PagamentoWhereUniqueInput | PagamentoWhereUniqueInput[]
    disconnect?: PagamentoWhereUniqueInput | PagamentoWhereUniqueInput[]
    delete?: PagamentoWhereUniqueInput | PagamentoWhereUniqueInput[]
    connect?: PagamentoWhereUniqueInput | PagamentoWhereUniqueInput[]
    update?: PagamentoUpdateWithWhereUniqueWithoutUserInput | PagamentoUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: PagamentoUpdateManyWithWhereWithoutUserInput | PagamentoUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: PagamentoScalarWhereInput | PagamentoScalarWhereInput[]
  }

  export type InventarioUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<InventarioCreateWithoutUserInput, InventarioUncheckedCreateWithoutUserInput> | InventarioCreateWithoutUserInput[] | InventarioUncheckedCreateWithoutUserInput[]
    connectOrCreate?: InventarioCreateOrConnectWithoutUserInput | InventarioCreateOrConnectWithoutUserInput[]
    upsert?: InventarioUpsertWithWhereUniqueWithoutUserInput | InventarioUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: InventarioCreateManyUserInputEnvelope
    set?: InventarioWhereUniqueInput | InventarioWhereUniqueInput[]
    disconnect?: InventarioWhereUniqueInput | InventarioWhereUniqueInput[]
    delete?: InventarioWhereUniqueInput | InventarioWhereUniqueInput[]
    connect?: InventarioWhereUniqueInput | InventarioWhereUniqueInput[]
    update?: InventarioUpdateWithWhereUniqueWithoutUserInput | InventarioUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: InventarioUpdateManyWithWhereWithoutUserInput | InventarioUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: InventarioScalarWhereInput | InventarioScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutPagamentosInput = {
    create?: XOR<UserCreateWithoutPagamentosInput, UserUncheckedCreateWithoutPagamentosInput>
    connectOrCreate?: UserCreateOrConnectWithoutPagamentosInput
    connect?: UserWhereUniqueInput
  }

  export type FloatFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type UserUpdateOneRequiredWithoutPagamentosNestedInput = {
    create?: XOR<UserCreateWithoutPagamentosInput, UserUncheckedCreateWithoutPagamentosInput>
    connectOrCreate?: UserCreateOrConnectWithoutPagamentosInput
    upsert?: UserUpsertWithoutPagamentosInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutPagamentosInput, UserUpdateWithoutPagamentosInput>, UserUncheckedUpdateWithoutPagamentosInput>
  }

  export type UserCreateNestedOneWithoutInventarioInput = {
    create?: XOR<UserCreateWithoutInventarioInput, UserUncheckedCreateWithoutInventarioInput>
    connectOrCreate?: UserCreateOrConnectWithoutInventarioInput
    connect?: UserWhereUniqueInput
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type UserUpdateOneRequiredWithoutInventarioNestedInput = {
    create?: XOR<UserCreateWithoutInventarioInput, UserUncheckedCreateWithoutInventarioInput>
    connectOrCreate?: UserCreateOrConnectWithoutInventarioInput
    upsert?: UserUpsertWithoutInventarioInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutInventarioInput, UserUpdateWithoutInventarioInput>, UserUncheckedUpdateWithoutInventarioInput>
  }

  export type FuncionarioCreatediasTrabalhoInput = {
    set: string[]
  }

  export type ControleJornadaCreateNestedManyWithoutFuncionarioInput = {
    create?: XOR<ControleJornadaCreateWithoutFuncionarioInput, ControleJornadaUncheckedCreateWithoutFuncionarioInput> | ControleJornadaCreateWithoutFuncionarioInput[] | ControleJornadaUncheckedCreateWithoutFuncionarioInput[]
    connectOrCreate?: ControleJornadaCreateOrConnectWithoutFuncionarioInput | ControleJornadaCreateOrConnectWithoutFuncionarioInput[]
    createMany?: ControleJornadaCreateManyFuncionarioInputEnvelope
    connect?: ControleJornadaWhereUniqueInput | ControleJornadaWhereUniqueInput[]
  }

  export type ResumoPagamentoCreateNestedManyWithoutFuncionarioInput = {
    create?: XOR<ResumoPagamentoCreateWithoutFuncionarioInput, ResumoPagamentoUncheckedCreateWithoutFuncionarioInput> | ResumoPagamentoCreateWithoutFuncionarioInput[] | ResumoPagamentoUncheckedCreateWithoutFuncionarioInput[]
    connectOrCreate?: ResumoPagamentoCreateOrConnectWithoutFuncionarioInput | ResumoPagamentoCreateOrConnectWithoutFuncionarioInput[]
    createMany?: ResumoPagamentoCreateManyFuncionarioInputEnvelope
    connect?: ResumoPagamentoWhereUniqueInput | ResumoPagamentoWhereUniqueInput[]
  }

  export type ControleJornadaUncheckedCreateNestedManyWithoutFuncionarioInput = {
    create?: XOR<ControleJornadaCreateWithoutFuncionarioInput, ControleJornadaUncheckedCreateWithoutFuncionarioInput> | ControleJornadaCreateWithoutFuncionarioInput[] | ControleJornadaUncheckedCreateWithoutFuncionarioInput[]
    connectOrCreate?: ControleJornadaCreateOrConnectWithoutFuncionarioInput | ControleJornadaCreateOrConnectWithoutFuncionarioInput[]
    createMany?: ControleJornadaCreateManyFuncionarioInputEnvelope
    connect?: ControleJornadaWhereUniqueInput | ControleJornadaWhereUniqueInput[]
  }

  export type ResumoPagamentoUncheckedCreateNestedManyWithoutFuncionarioInput = {
    create?: XOR<ResumoPagamentoCreateWithoutFuncionarioInput, ResumoPagamentoUncheckedCreateWithoutFuncionarioInput> | ResumoPagamentoCreateWithoutFuncionarioInput[] | ResumoPagamentoUncheckedCreateWithoutFuncionarioInput[]
    connectOrCreate?: ResumoPagamentoCreateOrConnectWithoutFuncionarioInput | ResumoPagamentoCreateOrConnectWithoutFuncionarioInput[]
    createMany?: ResumoPagamentoCreateManyFuncionarioInputEnvelope
    connect?: ResumoPagamentoWhereUniqueInput | ResumoPagamentoWhereUniqueInput[]
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type FuncionarioUpdatediasTrabalhoInput = {
    set?: string[]
    push?: string | string[]
  }

  export type ControleJornadaUpdateManyWithoutFuncionarioNestedInput = {
    create?: XOR<ControleJornadaCreateWithoutFuncionarioInput, ControleJornadaUncheckedCreateWithoutFuncionarioInput> | ControleJornadaCreateWithoutFuncionarioInput[] | ControleJornadaUncheckedCreateWithoutFuncionarioInput[]
    connectOrCreate?: ControleJornadaCreateOrConnectWithoutFuncionarioInput | ControleJornadaCreateOrConnectWithoutFuncionarioInput[]
    upsert?: ControleJornadaUpsertWithWhereUniqueWithoutFuncionarioInput | ControleJornadaUpsertWithWhereUniqueWithoutFuncionarioInput[]
    createMany?: ControleJornadaCreateManyFuncionarioInputEnvelope
    set?: ControleJornadaWhereUniqueInput | ControleJornadaWhereUniqueInput[]
    disconnect?: ControleJornadaWhereUniqueInput | ControleJornadaWhereUniqueInput[]
    delete?: ControleJornadaWhereUniqueInput | ControleJornadaWhereUniqueInput[]
    connect?: ControleJornadaWhereUniqueInput | ControleJornadaWhereUniqueInput[]
    update?: ControleJornadaUpdateWithWhereUniqueWithoutFuncionarioInput | ControleJornadaUpdateWithWhereUniqueWithoutFuncionarioInput[]
    updateMany?: ControleJornadaUpdateManyWithWhereWithoutFuncionarioInput | ControleJornadaUpdateManyWithWhereWithoutFuncionarioInput[]
    deleteMany?: ControleJornadaScalarWhereInput | ControleJornadaScalarWhereInput[]
  }

  export type ResumoPagamentoUpdateManyWithoutFuncionarioNestedInput = {
    create?: XOR<ResumoPagamentoCreateWithoutFuncionarioInput, ResumoPagamentoUncheckedCreateWithoutFuncionarioInput> | ResumoPagamentoCreateWithoutFuncionarioInput[] | ResumoPagamentoUncheckedCreateWithoutFuncionarioInput[]
    connectOrCreate?: ResumoPagamentoCreateOrConnectWithoutFuncionarioInput | ResumoPagamentoCreateOrConnectWithoutFuncionarioInput[]
    upsert?: ResumoPagamentoUpsertWithWhereUniqueWithoutFuncionarioInput | ResumoPagamentoUpsertWithWhereUniqueWithoutFuncionarioInput[]
    createMany?: ResumoPagamentoCreateManyFuncionarioInputEnvelope
    set?: ResumoPagamentoWhereUniqueInput | ResumoPagamentoWhereUniqueInput[]
    disconnect?: ResumoPagamentoWhereUniqueInput | ResumoPagamentoWhereUniqueInput[]
    delete?: ResumoPagamentoWhereUniqueInput | ResumoPagamentoWhereUniqueInput[]
    connect?: ResumoPagamentoWhereUniqueInput | ResumoPagamentoWhereUniqueInput[]
    update?: ResumoPagamentoUpdateWithWhereUniqueWithoutFuncionarioInput | ResumoPagamentoUpdateWithWhereUniqueWithoutFuncionarioInput[]
    updateMany?: ResumoPagamentoUpdateManyWithWhereWithoutFuncionarioInput | ResumoPagamentoUpdateManyWithWhereWithoutFuncionarioInput[]
    deleteMany?: ResumoPagamentoScalarWhereInput | ResumoPagamentoScalarWhereInput[]
  }

  export type ControleJornadaUncheckedUpdateManyWithoutFuncionarioNestedInput = {
    create?: XOR<ControleJornadaCreateWithoutFuncionarioInput, ControleJornadaUncheckedCreateWithoutFuncionarioInput> | ControleJornadaCreateWithoutFuncionarioInput[] | ControleJornadaUncheckedCreateWithoutFuncionarioInput[]
    connectOrCreate?: ControleJornadaCreateOrConnectWithoutFuncionarioInput | ControleJornadaCreateOrConnectWithoutFuncionarioInput[]
    upsert?: ControleJornadaUpsertWithWhereUniqueWithoutFuncionarioInput | ControleJornadaUpsertWithWhereUniqueWithoutFuncionarioInput[]
    createMany?: ControleJornadaCreateManyFuncionarioInputEnvelope
    set?: ControleJornadaWhereUniqueInput | ControleJornadaWhereUniqueInput[]
    disconnect?: ControleJornadaWhereUniqueInput | ControleJornadaWhereUniqueInput[]
    delete?: ControleJornadaWhereUniqueInput | ControleJornadaWhereUniqueInput[]
    connect?: ControleJornadaWhereUniqueInput | ControleJornadaWhereUniqueInput[]
    update?: ControleJornadaUpdateWithWhereUniqueWithoutFuncionarioInput | ControleJornadaUpdateWithWhereUniqueWithoutFuncionarioInput[]
    updateMany?: ControleJornadaUpdateManyWithWhereWithoutFuncionarioInput | ControleJornadaUpdateManyWithWhereWithoutFuncionarioInput[]
    deleteMany?: ControleJornadaScalarWhereInput | ControleJornadaScalarWhereInput[]
  }

  export type ResumoPagamentoUncheckedUpdateManyWithoutFuncionarioNestedInput = {
    create?: XOR<ResumoPagamentoCreateWithoutFuncionarioInput, ResumoPagamentoUncheckedCreateWithoutFuncionarioInput> | ResumoPagamentoCreateWithoutFuncionarioInput[] | ResumoPagamentoUncheckedCreateWithoutFuncionarioInput[]
    connectOrCreate?: ResumoPagamentoCreateOrConnectWithoutFuncionarioInput | ResumoPagamentoCreateOrConnectWithoutFuncionarioInput[]
    upsert?: ResumoPagamentoUpsertWithWhereUniqueWithoutFuncionarioInput | ResumoPagamentoUpsertWithWhereUniqueWithoutFuncionarioInput[]
    createMany?: ResumoPagamentoCreateManyFuncionarioInputEnvelope
    set?: ResumoPagamentoWhereUniqueInput | ResumoPagamentoWhereUniqueInput[]
    disconnect?: ResumoPagamentoWhereUniqueInput | ResumoPagamentoWhereUniqueInput[]
    delete?: ResumoPagamentoWhereUniqueInput | ResumoPagamentoWhereUniqueInput[]
    connect?: ResumoPagamentoWhereUniqueInput | ResumoPagamentoWhereUniqueInput[]
    update?: ResumoPagamentoUpdateWithWhereUniqueWithoutFuncionarioInput | ResumoPagamentoUpdateWithWhereUniqueWithoutFuncionarioInput[]
    updateMany?: ResumoPagamentoUpdateManyWithWhereWithoutFuncionarioInput | ResumoPagamentoUpdateManyWithWhereWithoutFuncionarioInput[]
    deleteMany?: ResumoPagamentoScalarWhereInput | ResumoPagamentoScalarWhereInput[]
  }

  export type FuncionarioCreateNestedOneWithoutControleJornadaInput = {
    create?: XOR<FuncionarioCreateWithoutControleJornadaInput, FuncionarioUncheckedCreateWithoutControleJornadaInput>
    connectOrCreate?: FuncionarioCreateOrConnectWithoutControleJornadaInput
    connect?: FuncionarioWhereUniqueInput
  }

  export type NullableFloatFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type FuncionarioUpdateOneRequiredWithoutControleJornadaNestedInput = {
    create?: XOR<FuncionarioCreateWithoutControleJornadaInput, FuncionarioUncheckedCreateWithoutControleJornadaInput>
    connectOrCreate?: FuncionarioCreateOrConnectWithoutControleJornadaInput
    upsert?: FuncionarioUpsertWithoutControleJornadaInput
    connect?: FuncionarioWhereUniqueInput
    update?: XOR<XOR<FuncionarioUpdateToOneWithWhereWithoutControleJornadaInput, FuncionarioUpdateWithoutControleJornadaInput>, FuncionarioUncheckedUpdateWithoutControleJornadaInput>
  }

  export type FuncionarioCreateNestedOneWithoutResumoPagamentoInput = {
    create?: XOR<FuncionarioCreateWithoutResumoPagamentoInput, FuncionarioUncheckedCreateWithoutResumoPagamentoInput>
    connectOrCreate?: FuncionarioCreateOrConnectWithoutResumoPagamentoInput
    connect?: FuncionarioWhereUniqueInput
  }

  export type FuncionarioUpdateOneRequiredWithoutResumoPagamentoNestedInput = {
    create?: XOR<FuncionarioCreateWithoutResumoPagamentoInput, FuncionarioUncheckedCreateWithoutResumoPagamentoInput>
    connectOrCreate?: FuncionarioCreateOrConnectWithoutResumoPagamentoInput
    upsert?: FuncionarioUpsertWithoutResumoPagamentoInput
    connect?: FuncionarioWhereUniqueInput
    update?: XOR<XOR<FuncionarioUpdateToOneWithWhereWithoutResumoPagamentoInput, FuncionarioUpdateWithoutResumoPagamentoInput>, FuncionarioUncheckedUpdateWithoutResumoPagamentoInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedFloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedFloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedFloatNullableFilter<$PrismaModel>
    _min?: NestedFloatNullableFilter<$PrismaModel>
    _max?: NestedFloatNullableFilter<$PrismaModel>
  }

  export type PagamentoCreateWithoutUserInput = {
    id?: string
    valor: number
    data: Date | string
    status: string
    descricao?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PagamentoUncheckedCreateWithoutUserInput = {
    id?: string
    valor: number
    data: Date | string
    status: string
    descricao?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PagamentoCreateOrConnectWithoutUserInput = {
    where: PagamentoWhereUniqueInput
    create: XOR<PagamentoCreateWithoutUserInput, PagamentoUncheckedCreateWithoutUserInput>
  }

  export type PagamentoCreateManyUserInputEnvelope = {
    data: PagamentoCreateManyUserInput | PagamentoCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type InventarioCreateWithoutUserInput = {
    id?: string
    nome: string
    quantidade: number
    preco: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type InventarioUncheckedCreateWithoutUserInput = {
    id?: string
    nome: string
    quantidade: number
    preco: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type InventarioCreateOrConnectWithoutUserInput = {
    where: InventarioWhereUniqueInput
    create: XOR<InventarioCreateWithoutUserInput, InventarioUncheckedCreateWithoutUserInput>
  }

  export type InventarioCreateManyUserInputEnvelope = {
    data: InventarioCreateManyUserInput | InventarioCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type PagamentoUpsertWithWhereUniqueWithoutUserInput = {
    where: PagamentoWhereUniqueInput
    update: XOR<PagamentoUpdateWithoutUserInput, PagamentoUncheckedUpdateWithoutUserInput>
    create: XOR<PagamentoCreateWithoutUserInput, PagamentoUncheckedCreateWithoutUserInput>
  }

  export type PagamentoUpdateWithWhereUniqueWithoutUserInput = {
    where: PagamentoWhereUniqueInput
    data: XOR<PagamentoUpdateWithoutUserInput, PagamentoUncheckedUpdateWithoutUserInput>
  }

  export type PagamentoUpdateManyWithWhereWithoutUserInput = {
    where: PagamentoScalarWhereInput
    data: XOR<PagamentoUpdateManyMutationInput, PagamentoUncheckedUpdateManyWithoutUserInput>
  }

  export type PagamentoScalarWhereInput = {
    AND?: PagamentoScalarWhereInput | PagamentoScalarWhereInput[]
    OR?: PagamentoScalarWhereInput[]
    NOT?: PagamentoScalarWhereInput | PagamentoScalarWhereInput[]
    id?: StringFilter<"Pagamento"> | string
    valor?: FloatFilter<"Pagamento"> | number
    data?: DateTimeFilter<"Pagamento"> | Date | string
    status?: StringFilter<"Pagamento"> | string
    descricao?: StringNullableFilter<"Pagamento"> | string | null
    userId?: StringFilter<"Pagamento"> | string
    createdAt?: DateTimeFilter<"Pagamento"> | Date | string
    updatedAt?: DateTimeFilter<"Pagamento"> | Date | string
  }

  export type InventarioUpsertWithWhereUniqueWithoutUserInput = {
    where: InventarioWhereUniqueInput
    update: XOR<InventarioUpdateWithoutUserInput, InventarioUncheckedUpdateWithoutUserInput>
    create: XOR<InventarioCreateWithoutUserInput, InventarioUncheckedCreateWithoutUserInput>
  }

  export type InventarioUpdateWithWhereUniqueWithoutUserInput = {
    where: InventarioWhereUniqueInput
    data: XOR<InventarioUpdateWithoutUserInput, InventarioUncheckedUpdateWithoutUserInput>
  }

  export type InventarioUpdateManyWithWhereWithoutUserInput = {
    where: InventarioScalarWhereInput
    data: XOR<InventarioUpdateManyMutationInput, InventarioUncheckedUpdateManyWithoutUserInput>
  }

  export type InventarioScalarWhereInput = {
    AND?: InventarioScalarWhereInput | InventarioScalarWhereInput[]
    OR?: InventarioScalarWhereInput[]
    NOT?: InventarioScalarWhereInput | InventarioScalarWhereInput[]
    id?: StringFilter<"Inventario"> | string
    nome?: StringFilter<"Inventario"> | string
    quantidade?: IntFilter<"Inventario"> | number
    preco?: FloatFilter<"Inventario"> | number
    userId?: StringFilter<"Inventario"> | string
    createdAt?: DateTimeFilter<"Inventario"> | Date | string
    updatedAt?: DateTimeFilter<"Inventario"> | Date | string
  }

  export type UserCreateWithoutPagamentosInput = {
    id?: string
    nome: string
    email: string
    cargo?: string | null
    telefone?: string | null
    setor?: string | null
    password: string
    permissoes?: string
    tipoNegocio?: string | null
    numeroFuncionarios?: number | null
    passwordResetToken?: string | null
    passwordResetExpires?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    inventario?: InventarioCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutPagamentosInput = {
    id?: string
    nome: string
    email: string
    cargo?: string | null
    telefone?: string | null
    setor?: string | null
    password: string
    permissoes?: string
    tipoNegocio?: string | null
    numeroFuncionarios?: number | null
    passwordResetToken?: string | null
    passwordResetExpires?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    inventario?: InventarioUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutPagamentosInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutPagamentosInput, UserUncheckedCreateWithoutPagamentosInput>
  }

  export type UserUpsertWithoutPagamentosInput = {
    update: XOR<UserUpdateWithoutPagamentosInput, UserUncheckedUpdateWithoutPagamentosInput>
    create: XOR<UserCreateWithoutPagamentosInput, UserUncheckedCreateWithoutPagamentosInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutPagamentosInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutPagamentosInput, UserUncheckedUpdateWithoutPagamentosInput>
  }

  export type UserUpdateWithoutPagamentosInput = {
    id?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    cargo?: NullableStringFieldUpdateOperationsInput | string | null
    telefone?: NullableStringFieldUpdateOperationsInput | string | null
    setor?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    permissoes?: StringFieldUpdateOperationsInput | string
    tipoNegocio?: NullableStringFieldUpdateOperationsInput | string | null
    numeroFuncionarios?: NullableIntFieldUpdateOperationsInput | number | null
    passwordResetToken?: NullableStringFieldUpdateOperationsInput | string | null
    passwordResetExpires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    inventario?: InventarioUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutPagamentosInput = {
    id?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    cargo?: NullableStringFieldUpdateOperationsInput | string | null
    telefone?: NullableStringFieldUpdateOperationsInput | string | null
    setor?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    permissoes?: StringFieldUpdateOperationsInput | string
    tipoNegocio?: NullableStringFieldUpdateOperationsInput | string | null
    numeroFuncionarios?: NullableIntFieldUpdateOperationsInput | number | null
    passwordResetToken?: NullableStringFieldUpdateOperationsInput | string | null
    passwordResetExpires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    inventario?: InventarioUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateWithoutInventarioInput = {
    id?: string
    nome: string
    email: string
    cargo?: string | null
    telefone?: string | null
    setor?: string | null
    password: string
    permissoes?: string
    tipoNegocio?: string | null
    numeroFuncionarios?: number | null
    passwordResetToken?: string | null
    passwordResetExpires?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    pagamentos?: PagamentoCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutInventarioInput = {
    id?: string
    nome: string
    email: string
    cargo?: string | null
    telefone?: string | null
    setor?: string | null
    password: string
    permissoes?: string
    tipoNegocio?: string | null
    numeroFuncionarios?: number | null
    passwordResetToken?: string | null
    passwordResetExpires?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    pagamentos?: PagamentoUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutInventarioInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutInventarioInput, UserUncheckedCreateWithoutInventarioInput>
  }

  export type UserUpsertWithoutInventarioInput = {
    update: XOR<UserUpdateWithoutInventarioInput, UserUncheckedUpdateWithoutInventarioInput>
    create: XOR<UserCreateWithoutInventarioInput, UserUncheckedCreateWithoutInventarioInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutInventarioInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutInventarioInput, UserUncheckedUpdateWithoutInventarioInput>
  }

  export type UserUpdateWithoutInventarioInput = {
    id?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    cargo?: NullableStringFieldUpdateOperationsInput | string | null
    telefone?: NullableStringFieldUpdateOperationsInput | string | null
    setor?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    permissoes?: StringFieldUpdateOperationsInput | string
    tipoNegocio?: NullableStringFieldUpdateOperationsInput | string | null
    numeroFuncionarios?: NullableIntFieldUpdateOperationsInput | number | null
    passwordResetToken?: NullableStringFieldUpdateOperationsInput | string | null
    passwordResetExpires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    pagamentos?: PagamentoUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutInventarioInput = {
    id?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    cargo?: NullableStringFieldUpdateOperationsInput | string | null
    telefone?: NullableStringFieldUpdateOperationsInput | string | null
    setor?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    permissoes?: StringFieldUpdateOperationsInput | string
    tipoNegocio?: NullableStringFieldUpdateOperationsInput | string | null
    numeroFuncionarios?: NullableIntFieldUpdateOperationsInput | number | null
    passwordResetToken?: NullableStringFieldUpdateOperationsInput | string | null
    passwordResetExpires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    pagamentos?: PagamentoUncheckedUpdateManyWithoutUserNestedInput
  }

  export type ControleJornadaCreateWithoutFuncionarioInput = {
    id?: string
    data: Date | string
    horaEntrada: string
    horaSaida: string
    horasTrabalhadas: number
    horaExtra?: number | null
    faltaJustificada: boolean
    observacoes?: string | null
    dataCriacao?: Date | string
    dataAtualizacao?: Date | string
  }

  export type ControleJornadaUncheckedCreateWithoutFuncionarioInput = {
    id?: string
    data: Date | string
    horaEntrada: string
    horaSaida: string
    horasTrabalhadas: number
    horaExtra?: number | null
    faltaJustificada: boolean
    observacoes?: string | null
    dataCriacao?: Date | string
    dataAtualizacao?: Date | string
  }

  export type ControleJornadaCreateOrConnectWithoutFuncionarioInput = {
    where: ControleJornadaWhereUniqueInput
    create: XOR<ControleJornadaCreateWithoutFuncionarioInput, ControleJornadaUncheckedCreateWithoutFuncionarioInput>
  }

  export type ControleJornadaCreateManyFuncionarioInputEnvelope = {
    data: ControleJornadaCreateManyFuncionarioInput | ControleJornadaCreateManyFuncionarioInput[]
    skipDuplicates?: boolean
  }

  export type ResumoPagamentoCreateWithoutFuncionarioInput = {
    id?: string
    mes: string
    salarioPrevisto: number
    salarioReal: number
    extras?: number | null
    descontos?: number | null
    observacoes?: string | null
    enviadoParaContador?: boolean
    dataCriacao?: Date | string
    dataAtualizacao?: Date | string
  }

  export type ResumoPagamentoUncheckedCreateWithoutFuncionarioInput = {
    id?: string
    mes: string
    salarioPrevisto: number
    salarioReal: number
    extras?: number | null
    descontos?: number | null
    observacoes?: string | null
    enviadoParaContador?: boolean
    dataCriacao?: Date | string
    dataAtualizacao?: Date | string
  }

  export type ResumoPagamentoCreateOrConnectWithoutFuncionarioInput = {
    where: ResumoPagamentoWhereUniqueInput
    create: XOR<ResumoPagamentoCreateWithoutFuncionarioInput, ResumoPagamentoUncheckedCreateWithoutFuncionarioInput>
  }

  export type ResumoPagamentoCreateManyFuncionarioInputEnvelope = {
    data: ResumoPagamentoCreateManyFuncionarioInput | ResumoPagamentoCreateManyFuncionarioInput[]
    skipDuplicates?: boolean
  }

  export type ControleJornadaUpsertWithWhereUniqueWithoutFuncionarioInput = {
    where: ControleJornadaWhereUniqueInput
    update: XOR<ControleJornadaUpdateWithoutFuncionarioInput, ControleJornadaUncheckedUpdateWithoutFuncionarioInput>
    create: XOR<ControleJornadaCreateWithoutFuncionarioInput, ControleJornadaUncheckedCreateWithoutFuncionarioInput>
  }

  export type ControleJornadaUpdateWithWhereUniqueWithoutFuncionarioInput = {
    where: ControleJornadaWhereUniqueInput
    data: XOR<ControleJornadaUpdateWithoutFuncionarioInput, ControleJornadaUncheckedUpdateWithoutFuncionarioInput>
  }

  export type ControleJornadaUpdateManyWithWhereWithoutFuncionarioInput = {
    where: ControleJornadaScalarWhereInput
    data: XOR<ControleJornadaUpdateManyMutationInput, ControleJornadaUncheckedUpdateManyWithoutFuncionarioInput>
  }

  export type ControleJornadaScalarWhereInput = {
    AND?: ControleJornadaScalarWhereInput | ControleJornadaScalarWhereInput[]
    OR?: ControleJornadaScalarWhereInput[]
    NOT?: ControleJornadaScalarWhereInput | ControleJornadaScalarWhereInput[]
    id?: StringFilter<"ControleJornada"> | string
    funcionarioId?: StringFilter<"ControleJornada"> | string
    data?: DateTimeFilter<"ControleJornada"> | Date | string
    horaEntrada?: StringFilter<"ControleJornada"> | string
    horaSaida?: StringFilter<"ControleJornada"> | string
    horasTrabalhadas?: FloatFilter<"ControleJornada"> | number
    horaExtra?: FloatNullableFilter<"ControleJornada"> | number | null
    faltaJustificada?: BoolFilter<"ControleJornada"> | boolean
    observacoes?: StringNullableFilter<"ControleJornada"> | string | null
    dataCriacao?: DateTimeFilter<"ControleJornada"> | Date | string
    dataAtualizacao?: DateTimeFilter<"ControleJornada"> | Date | string
  }

  export type ResumoPagamentoUpsertWithWhereUniqueWithoutFuncionarioInput = {
    where: ResumoPagamentoWhereUniqueInput
    update: XOR<ResumoPagamentoUpdateWithoutFuncionarioInput, ResumoPagamentoUncheckedUpdateWithoutFuncionarioInput>
    create: XOR<ResumoPagamentoCreateWithoutFuncionarioInput, ResumoPagamentoUncheckedCreateWithoutFuncionarioInput>
  }

  export type ResumoPagamentoUpdateWithWhereUniqueWithoutFuncionarioInput = {
    where: ResumoPagamentoWhereUniqueInput
    data: XOR<ResumoPagamentoUpdateWithoutFuncionarioInput, ResumoPagamentoUncheckedUpdateWithoutFuncionarioInput>
  }

  export type ResumoPagamentoUpdateManyWithWhereWithoutFuncionarioInput = {
    where: ResumoPagamentoScalarWhereInput
    data: XOR<ResumoPagamentoUpdateManyMutationInput, ResumoPagamentoUncheckedUpdateManyWithoutFuncionarioInput>
  }

  export type ResumoPagamentoScalarWhereInput = {
    AND?: ResumoPagamentoScalarWhereInput | ResumoPagamentoScalarWhereInput[]
    OR?: ResumoPagamentoScalarWhereInput[]
    NOT?: ResumoPagamentoScalarWhereInput | ResumoPagamentoScalarWhereInput[]
    id?: StringFilter<"ResumoPagamento"> | string
    funcionarioId?: StringFilter<"ResumoPagamento"> | string
    mes?: StringFilter<"ResumoPagamento"> | string
    salarioPrevisto?: FloatFilter<"ResumoPagamento"> | number
    salarioReal?: FloatFilter<"ResumoPagamento"> | number
    extras?: FloatNullableFilter<"ResumoPagamento"> | number | null
    descontos?: FloatNullableFilter<"ResumoPagamento"> | number | null
    observacoes?: StringNullableFilter<"ResumoPagamento"> | string | null
    enviadoParaContador?: BoolFilter<"ResumoPagamento"> | boolean
    dataCriacao?: DateTimeFilter<"ResumoPagamento"> | Date | string
    dataAtualizacao?: DateTimeFilter<"ResumoPagamento"> | Date | string
  }

  export type FuncionarioCreateWithoutControleJornadaInput = {
    id?: string
    nome: string
    cargo: string
    tipoContrato: string
    dataAdmissao: Date | string
    salarioBruto: number
    pagamentoPorHora: boolean
    horasSemana: number
    diasTrabalho?: FuncionarioCreatediasTrabalhoInput | string[]
    iban?: string | null
    status: string
    observacoes?: string | null
    contratoUploadUrl?: string | null
    dataCriacao?: Date | string
    dataAtualizacao?: Date | string
    resumoPagamento?: ResumoPagamentoCreateNestedManyWithoutFuncionarioInput
  }

  export type FuncionarioUncheckedCreateWithoutControleJornadaInput = {
    id?: string
    nome: string
    cargo: string
    tipoContrato: string
    dataAdmissao: Date | string
    salarioBruto: number
    pagamentoPorHora: boolean
    horasSemana: number
    diasTrabalho?: FuncionarioCreatediasTrabalhoInput | string[]
    iban?: string | null
    status: string
    observacoes?: string | null
    contratoUploadUrl?: string | null
    dataCriacao?: Date | string
    dataAtualizacao?: Date | string
    resumoPagamento?: ResumoPagamentoUncheckedCreateNestedManyWithoutFuncionarioInput
  }

  export type FuncionarioCreateOrConnectWithoutControleJornadaInput = {
    where: FuncionarioWhereUniqueInput
    create: XOR<FuncionarioCreateWithoutControleJornadaInput, FuncionarioUncheckedCreateWithoutControleJornadaInput>
  }

  export type FuncionarioUpsertWithoutControleJornadaInput = {
    update: XOR<FuncionarioUpdateWithoutControleJornadaInput, FuncionarioUncheckedUpdateWithoutControleJornadaInput>
    create: XOR<FuncionarioCreateWithoutControleJornadaInput, FuncionarioUncheckedCreateWithoutControleJornadaInput>
    where?: FuncionarioWhereInput
  }

  export type FuncionarioUpdateToOneWithWhereWithoutControleJornadaInput = {
    where?: FuncionarioWhereInput
    data: XOR<FuncionarioUpdateWithoutControleJornadaInput, FuncionarioUncheckedUpdateWithoutControleJornadaInput>
  }

  export type FuncionarioUpdateWithoutControleJornadaInput = {
    id?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    cargo?: StringFieldUpdateOperationsInput | string
    tipoContrato?: StringFieldUpdateOperationsInput | string
    dataAdmissao?: DateTimeFieldUpdateOperationsInput | Date | string
    salarioBruto?: FloatFieldUpdateOperationsInput | number
    pagamentoPorHora?: BoolFieldUpdateOperationsInput | boolean
    horasSemana?: FloatFieldUpdateOperationsInput | number
    diasTrabalho?: FuncionarioUpdatediasTrabalhoInput | string[]
    iban?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    observacoes?: NullableStringFieldUpdateOperationsInput | string | null
    contratoUploadUrl?: NullableStringFieldUpdateOperationsInput | string | null
    dataCriacao?: DateTimeFieldUpdateOperationsInput | Date | string
    dataAtualizacao?: DateTimeFieldUpdateOperationsInput | Date | string
    resumoPagamento?: ResumoPagamentoUpdateManyWithoutFuncionarioNestedInput
  }

  export type FuncionarioUncheckedUpdateWithoutControleJornadaInput = {
    id?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    cargo?: StringFieldUpdateOperationsInput | string
    tipoContrato?: StringFieldUpdateOperationsInput | string
    dataAdmissao?: DateTimeFieldUpdateOperationsInput | Date | string
    salarioBruto?: FloatFieldUpdateOperationsInput | number
    pagamentoPorHora?: BoolFieldUpdateOperationsInput | boolean
    horasSemana?: FloatFieldUpdateOperationsInput | number
    diasTrabalho?: FuncionarioUpdatediasTrabalhoInput | string[]
    iban?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    observacoes?: NullableStringFieldUpdateOperationsInput | string | null
    contratoUploadUrl?: NullableStringFieldUpdateOperationsInput | string | null
    dataCriacao?: DateTimeFieldUpdateOperationsInput | Date | string
    dataAtualizacao?: DateTimeFieldUpdateOperationsInput | Date | string
    resumoPagamento?: ResumoPagamentoUncheckedUpdateManyWithoutFuncionarioNestedInput
  }

  export type FuncionarioCreateWithoutResumoPagamentoInput = {
    id?: string
    nome: string
    cargo: string
    tipoContrato: string
    dataAdmissao: Date | string
    salarioBruto: number
    pagamentoPorHora: boolean
    horasSemana: number
    diasTrabalho?: FuncionarioCreatediasTrabalhoInput | string[]
    iban?: string | null
    status: string
    observacoes?: string | null
    contratoUploadUrl?: string | null
    dataCriacao?: Date | string
    dataAtualizacao?: Date | string
    controleJornada?: ControleJornadaCreateNestedManyWithoutFuncionarioInput
  }

  export type FuncionarioUncheckedCreateWithoutResumoPagamentoInput = {
    id?: string
    nome: string
    cargo: string
    tipoContrato: string
    dataAdmissao: Date | string
    salarioBruto: number
    pagamentoPorHora: boolean
    horasSemana: number
    diasTrabalho?: FuncionarioCreatediasTrabalhoInput | string[]
    iban?: string | null
    status: string
    observacoes?: string | null
    contratoUploadUrl?: string | null
    dataCriacao?: Date | string
    dataAtualizacao?: Date | string
    controleJornada?: ControleJornadaUncheckedCreateNestedManyWithoutFuncionarioInput
  }

  export type FuncionarioCreateOrConnectWithoutResumoPagamentoInput = {
    where: FuncionarioWhereUniqueInput
    create: XOR<FuncionarioCreateWithoutResumoPagamentoInput, FuncionarioUncheckedCreateWithoutResumoPagamentoInput>
  }

  export type FuncionarioUpsertWithoutResumoPagamentoInput = {
    update: XOR<FuncionarioUpdateWithoutResumoPagamentoInput, FuncionarioUncheckedUpdateWithoutResumoPagamentoInput>
    create: XOR<FuncionarioCreateWithoutResumoPagamentoInput, FuncionarioUncheckedCreateWithoutResumoPagamentoInput>
    where?: FuncionarioWhereInput
  }

  export type FuncionarioUpdateToOneWithWhereWithoutResumoPagamentoInput = {
    where?: FuncionarioWhereInput
    data: XOR<FuncionarioUpdateWithoutResumoPagamentoInput, FuncionarioUncheckedUpdateWithoutResumoPagamentoInput>
  }

  export type FuncionarioUpdateWithoutResumoPagamentoInput = {
    id?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    cargo?: StringFieldUpdateOperationsInput | string
    tipoContrato?: StringFieldUpdateOperationsInput | string
    dataAdmissao?: DateTimeFieldUpdateOperationsInput | Date | string
    salarioBruto?: FloatFieldUpdateOperationsInput | number
    pagamentoPorHora?: BoolFieldUpdateOperationsInput | boolean
    horasSemana?: FloatFieldUpdateOperationsInput | number
    diasTrabalho?: FuncionarioUpdatediasTrabalhoInput | string[]
    iban?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    observacoes?: NullableStringFieldUpdateOperationsInput | string | null
    contratoUploadUrl?: NullableStringFieldUpdateOperationsInput | string | null
    dataCriacao?: DateTimeFieldUpdateOperationsInput | Date | string
    dataAtualizacao?: DateTimeFieldUpdateOperationsInput | Date | string
    controleJornada?: ControleJornadaUpdateManyWithoutFuncionarioNestedInput
  }

  export type FuncionarioUncheckedUpdateWithoutResumoPagamentoInput = {
    id?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    cargo?: StringFieldUpdateOperationsInput | string
    tipoContrato?: StringFieldUpdateOperationsInput | string
    dataAdmissao?: DateTimeFieldUpdateOperationsInput | Date | string
    salarioBruto?: FloatFieldUpdateOperationsInput | number
    pagamentoPorHora?: BoolFieldUpdateOperationsInput | boolean
    horasSemana?: FloatFieldUpdateOperationsInput | number
    diasTrabalho?: FuncionarioUpdatediasTrabalhoInput | string[]
    iban?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    observacoes?: NullableStringFieldUpdateOperationsInput | string | null
    contratoUploadUrl?: NullableStringFieldUpdateOperationsInput | string | null
    dataCriacao?: DateTimeFieldUpdateOperationsInput | Date | string
    dataAtualizacao?: DateTimeFieldUpdateOperationsInput | Date | string
    controleJornada?: ControleJornadaUncheckedUpdateManyWithoutFuncionarioNestedInput
  }

  export type PagamentoCreateManyUserInput = {
    id?: string
    valor: number
    data: Date | string
    status: string
    descricao?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type InventarioCreateManyUserInput = {
    id?: string
    nome: string
    quantidade: number
    preco: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PagamentoUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    valor?: FloatFieldUpdateOperationsInput | number
    data?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
    descricao?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PagamentoUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    valor?: FloatFieldUpdateOperationsInput | number
    data?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
    descricao?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PagamentoUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    valor?: FloatFieldUpdateOperationsInput | number
    data?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
    descricao?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InventarioUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    quantidade?: IntFieldUpdateOperationsInput | number
    preco?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InventarioUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    quantidade?: IntFieldUpdateOperationsInput | number
    preco?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InventarioUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    quantidade?: IntFieldUpdateOperationsInput | number
    preco?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ControleJornadaCreateManyFuncionarioInput = {
    id?: string
    data: Date | string
    horaEntrada: string
    horaSaida: string
    horasTrabalhadas: number
    horaExtra?: number | null
    faltaJustificada: boolean
    observacoes?: string | null
    dataCriacao?: Date | string
    dataAtualizacao?: Date | string
  }

  export type ResumoPagamentoCreateManyFuncionarioInput = {
    id?: string
    mes: string
    salarioPrevisto: number
    salarioReal: number
    extras?: number | null
    descontos?: number | null
    observacoes?: string | null
    enviadoParaContador?: boolean
    dataCriacao?: Date | string
    dataAtualizacao?: Date | string
  }

  export type ControleJornadaUpdateWithoutFuncionarioInput = {
    id?: StringFieldUpdateOperationsInput | string
    data?: DateTimeFieldUpdateOperationsInput | Date | string
    horaEntrada?: StringFieldUpdateOperationsInput | string
    horaSaida?: StringFieldUpdateOperationsInput | string
    horasTrabalhadas?: FloatFieldUpdateOperationsInput | number
    horaExtra?: NullableFloatFieldUpdateOperationsInput | number | null
    faltaJustificada?: BoolFieldUpdateOperationsInput | boolean
    observacoes?: NullableStringFieldUpdateOperationsInput | string | null
    dataCriacao?: DateTimeFieldUpdateOperationsInput | Date | string
    dataAtualizacao?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ControleJornadaUncheckedUpdateWithoutFuncionarioInput = {
    id?: StringFieldUpdateOperationsInput | string
    data?: DateTimeFieldUpdateOperationsInput | Date | string
    horaEntrada?: StringFieldUpdateOperationsInput | string
    horaSaida?: StringFieldUpdateOperationsInput | string
    horasTrabalhadas?: FloatFieldUpdateOperationsInput | number
    horaExtra?: NullableFloatFieldUpdateOperationsInput | number | null
    faltaJustificada?: BoolFieldUpdateOperationsInput | boolean
    observacoes?: NullableStringFieldUpdateOperationsInput | string | null
    dataCriacao?: DateTimeFieldUpdateOperationsInput | Date | string
    dataAtualizacao?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ControleJornadaUncheckedUpdateManyWithoutFuncionarioInput = {
    id?: StringFieldUpdateOperationsInput | string
    data?: DateTimeFieldUpdateOperationsInput | Date | string
    horaEntrada?: StringFieldUpdateOperationsInput | string
    horaSaida?: StringFieldUpdateOperationsInput | string
    horasTrabalhadas?: FloatFieldUpdateOperationsInput | number
    horaExtra?: NullableFloatFieldUpdateOperationsInput | number | null
    faltaJustificada?: BoolFieldUpdateOperationsInput | boolean
    observacoes?: NullableStringFieldUpdateOperationsInput | string | null
    dataCriacao?: DateTimeFieldUpdateOperationsInput | Date | string
    dataAtualizacao?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ResumoPagamentoUpdateWithoutFuncionarioInput = {
    id?: StringFieldUpdateOperationsInput | string
    mes?: StringFieldUpdateOperationsInput | string
    salarioPrevisto?: FloatFieldUpdateOperationsInput | number
    salarioReal?: FloatFieldUpdateOperationsInput | number
    extras?: NullableFloatFieldUpdateOperationsInput | number | null
    descontos?: NullableFloatFieldUpdateOperationsInput | number | null
    observacoes?: NullableStringFieldUpdateOperationsInput | string | null
    enviadoParaContador?: BoolFieldUpdateOperationsInput | boolean
    dataCriacao?: DateTimeFieldUpdateOperationsInput | Date | string
    dataAtualizacao?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ResumoPagamentoUncheckedUpdateWithoutFuncionarioInput = {
    id?: StringFieldUpdateOperationsInput | string
    mes?: StringFieldUpdateOperationsInput | string
    salarioPrevisto?: FloatFieldUpdateOperationsInput | number
    salarioReal?: FloatFieldUpdateOperationsInput | number
    extras?: NullableFloatFieldUpdateOperationsInput | number | null
    descontos?: NullableFloatFieldUpdateOperationsInput | number | null
    observacoes?: NullableStringFieldUpdateOperationsInput | string | null
    enviadoParaContador?: BoolFieldUpdateOperationsInput | boolean
    dataCriacao?: DateTimeFieldUpdateOperationsInput | Date | string
    dataAtualizacao?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ResumoPagamentoUncheckedUpdateManyWithoutFuncionarioInput = {
    id?: StringFieldUpdateOperationsInput | string
    mes?: StringFieldUpdateOperationsInput | string
    salarioPrevisto?: FloatFieldUpdateOperationsInput | number
    salarioReal?: FloatFieldUpdateOperationsInput | number
    extras?: NullableFloatFieldUpdateOperationsInput | number | null
    descontos?: NullableFloatFieldUpdateOperationsInput | number | null
    observacoes?: NullableStringFieldUpdateOperationsInput | string | null
    enviadoParaContador?: BoolFieldUpdateOperationsInput | boolean
    dataCriacao?: DateTimeFieldUpdateOperationsInput | Date | string
    dataAtualizacao?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}