import { Response } from 'express';
import { Body, JsonController, Post, Res } from 'routing-controllers';
import { Inject } from 'typedi';
import { ImportBrandsDTO } from '../dtos/importBrandsDto';
import { ImportPublisher } from '../publishers/importPublisher';

/**
 *
 */
@JsonController('/import')
export class ImportController {
  @Inject()
  private readonly importPublisherService: ImportPublisher;

  @Post('/brands')
  postBrands(
    @Body() importBrandsDTO: ImportBrandsDTO,
    @Res() response: Response
  ): Response {
    this.importPublisherService.queueImportBrandsSequence(importBrandsDTO);
    return response.status(202).send('Import is starting!');
  }
}
