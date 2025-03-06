const cds = require('@sap/cds')

class ProcessorService extends cds.ApplicationService {
    /** Registering custom event handlers */
    init() {
        this.before("UPDATE", "Incidents", (req) => this.onUpdate(req));
        this.before("CREATE", "Incidents", (req) => this.changeUrgencyDueToSubject(req.data));

        return super.init();
    }

    changeUrgencyDueToSubject(data) {
        if (data) {
            const incidents = Array.isArray(data) ? data : [data];
            incidents.forEach((incident) => {
                if (incident.title?.toLowerCase().includes("urgent")) {
                    incident.urgency = { code: "H", descr: "High" };
                }
            });
        }
    }

    /** Custom Validation */
    async onUpdate(req) {
        const { status_code } = await SELECT.one(req.subject, i => i.status_code).where({ ID: req.data.ID })
        if (status_code === 'C')
            return req.reject(`Can't modify a closed incident`)
    }
}

class ViewService extends cds.ApplicationService {
    /** Registering custom event handlers */
    init() {
        this.before("GET", "UsingView", (req) => this.fetchView(req.params));
        
        return super.init();
    }

    async fetchView(params) {
        let p1 = params[0].p1;
        const query = SELECT.from({ ref: [{ id: 'ViewService_UsingView', args: { p1: { val: p1 }}} ]} );
        console.log("query:", query);
        const db = await cds.connect.to('db');
        const result = await db.run(query);
        console.log("result:", result);
    }
}


module.exports = { ProcessorService, ViewService }
