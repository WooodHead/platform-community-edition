import { Module, Logger, Provider } from '@nestjs/common';
import {
  AwsConfigService,
  AwsApiGatewayService,
  AwsLambdaService
} from './aws';
import { APIGateway, Lambda, S3 } from 'aws-sdk';
import { AwsS3Service } from './aws/aws-s3.service';
import { PhotonModule } from '@visual-knight/api-interface';
import { CloudProviderZeitModule } from '@visual-knight/cloud-provider-zeit';

const services: Provider[] = [Logger];

@Module({
  imports: [PhotonModule, CloudProviderZeitModule],
  providers: [
    AwsConfigService,
    {
      provide: AwsApiGatewayService,
      useFactory: (config: AwsConfigService) => {
        return new APIGateway(config);
      },
      inject: [AwsConfigService]
    },
    {
      provide: AwsLambdaService,
      useFactory: (config: AwsConfigService) => {
        return new Lambda(config);
      },
      inject: [AwsConfigService]
    },
    {
      provide: AwsS3Service,
      useFactory: (config: AwsConfigService) => {
        return new S3(config);
      },
      inject: [AwsConfigService]
    },
    ...services
  ],
  exports: [
    ...services,
    AwsApiGatewayService,
    AwsS3Service,
    AwsLambdaService,
    PhotonModule,
    CloudProviderZeitModule
  ]
})
export class SharedModule {}
