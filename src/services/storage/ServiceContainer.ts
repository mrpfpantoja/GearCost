import { IVehicleRepository } from '../../domain/contracts/IVehicleRepository';
import { IUserRepository } from '../../domain/contracts/IUserRepository';
import { IPreferenceRepository } from '../../domain/contracts/IPreferenceRepository';
import { LocalStorageVehicleRepository } from './LocalStorageVehicleRepository';
import { LocalStorageUserRepository } from './LocalStorageUserRepository';
import { LocalStoragePreferenceRepository } from './LocalStoragePreferenceRepository';
import { VehicleMetricsCalculator } from '../../domain/services/VehicleMetricsCalculator';
import { TelemetryEvaluator } from '../../domain/services/TelemetryEvaluator';

/**
 * [DIP - Dependency Inversion Principle]
 * Service Container / IoC Registry desacoplado para injeção de dependências
 */
export class ServiceContainer {
  private static vehicleRepo: IVehicleRepository = new LocalStorageVehicleRepository();
  private static userRepo: IUserRepository = new LocalStorageUserRepository();
  private static preferenceRepo: IPreferenceRepository = new LocalStoragePreferenceRepository();
  private static telemetryEvaluator: TelemetryEvaluator = new TelemetryEvaluator();

  /**
   * Permite substituir implementações para testes ou novos backends (ex: SQLite nativo, API REST, IndexedDB)
   */
  static configure(customServices: {
    vehicleRepo?: IVehicleRepository;
    userRepo?: IUserRepository;
    preferenceRepo?: IPreferenceRepository;
    telemetryEvaluator?: TelemetryEvaluator;
  }): void {
    if (customServices.vehicleRepo) this.vehicleRepo = customServices.vehicleRepo;
    if (customServices.userRepo) this.userRepo = customServices.userRepo;
    if (customServices.preferenceRepo) this.preferenceRepo = customServices.preferenceRepo;
    if (customServices.telemetryEvaluator) this.telemetryEvaluator = customServices.telemetryEvaluator;
  }

  static getVehicleRepository(): IVehicleRepository {
    return this.vehicleRepo;
  }

  static getUserRepository(): IUserRepository {
    return this.userRepo;
  }

  static getPreferenceRepository(): IPreferenceRepository {
    return this.preferenceRepo;
  }

  static getTelemetryEvaluator(): TelemetryEvaluator {
    return this.telemetryEvaluator;
  }

  static getMetricsCalculator(): typeof VehicleMetricsCalculator {
    return VehicleMetricsCalculator;
  }
}
