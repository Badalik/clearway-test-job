import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { first, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiFilesService {

  private readonly _http = inject(HttpClient);

  private readonly _baseUrl = '/files';

  public downloadImage(url: string): Observable<Blob> {
    return this._http.get(
      `${this._baseUrl}/${url}`,
      {
        // observe: 'events',
        responseType: 'blob',
      },
    )
      .pipe(
        first(),
      );
  }

}
