import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { first, Observable } from 'rxjs';

import { DocumentResponse } from '@core/models';

@Injectable({
  providedIn: 'root',
})
export class ApiService {

  private readonly _http = inject(HttpClient);

  private readonly _baseUrl = '/api';

  public getDocumentById(id: string | null): Observable<DocumentResponse> {
    return this._http.get<DocumentResponse>(`${this._baseUrl}/documents/${id}.json`)
      .pipe(first());
  }

}
