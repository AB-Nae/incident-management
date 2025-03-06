using {sap.capire.incidents as my} from '../db/schema';

/**
 * Service used by support personell, i.e. the incidents' 'processors'.
 * '/odata/v4/processor'
 */
service ProcessorService {
  entity Incidents as projection on my.Incidents;

  @readonly
  entity Customers as projection on my.Customers;
}

annotate ProcessorService.Incidents with @odata.draft.enabled;
annotate ProcessorService with @(requires: 'support');

/**
 * Service used by administrators to manage customers and incidents.
 * '/odata/v4/admin'
 */
service AdminService {
  entity Customers as projection on my.Customers;
  entity Incidents as projection on my.Incidents;
}

annotate AdminService with @(requires: 'admin');

/**
 * Service used by View Test.
 * '/odata/v4/view'
 */
service ViewService {
  entity UsingView(p1 : String)   as
    select from my.CustomersView (
      p1: :p1
    ) {
      *
    };

  @cds.redirection.target
  entity UsingView2(p1 : String)  as
    select * from my.Customers
    where
      ID = :p1;

  entity UsingView3(sts : String) as
    select from my.IncidentsView (
      sts: :sts
    ) {
      *
    };

  @cds.redirection.target
  entity UsingView4(sts : String) as
    select * from my.Incidents
    where
      status.code = :sts;
}

annotate ViewService with @(requires: 'admin');