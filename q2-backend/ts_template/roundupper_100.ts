import express from 'express';

// location is the simple (x, y) coordinates of an entity within the system
// spaceCowboy models a cowboy in our super amazing system
// spaceAnimal models a single animal in our amazing system
type location = { x: number, y: number };
type spaceCowboy = { name: string, lassoLength: number };
type spaceAnimal = { type: "pig" | "cow" | "flying_burger" };

// spaceEntity models an entity in the super amazing (ROUND UPPER 100) system
type spaceEntity =
    | { type: "space_cowboy", metadata: spaceCowboy, location: location }
    | { type: "space_animal", metadata: spaceAnimal, location: location };


// === ADD YOUR CODE BELOW :D ===

// entityCreateRequest model
type entityCreateRequest = { entities: spaceEntity[] };

// lassoableRequest model
type lassoableRequest = { cowboy_name: String };


// === ExpressJS setup + Server setup ===
const spaceDatabase = [] as spaceEntity[];
const app = express();

// Configure to use JSON
app.use(express.json());

// the POST /entity endpoint adds an entity to your global space database
app.post('/entity', (req: express.Request<{}, {}, entityCreateRequest>, res) => {

    // Send "Bad Request" if JSON is not correct
    // TODO: Find better way to find its errro (right now entities has to be misspelt)
    if (
        req.body.entities == null
        || req.body.entities.length == 0
        || containsInvalidEntities(req.body.entities)
    ) {
        res.sendStatus(400);
        return;
    }
    
    // Add entities to database
    req.body.entities.forEach((e) => {
        spaceDatabase.push(e)
    });

    res.sendStatus(200);
});

// lasooable returns all the space animals a space cowboy can lasso given their name
app.get('/lassoable', (req: express.Request<{}, {}, lassoableRequest>, res) => {


    if (containsInvalidCowboy(req.body)) { res.sendStatus(400); return; }

    let lassoLength = 0;
    let cowboyLocation = { x: 0, y: 0} as location;

    let foundEntity = spaceDatabase.find(function(e) {
        return e.type === "space_cowboy" && e.metadata.name === req.body.cowboy_name;
    });

    if (foundEntity == null) {
        res.sendStatus(404);
        return
    }

    if (foundEntity.type == "space_cowboy") {
        lassoLength = foundEntity.metadata.lassoLength;
        cowboyLocation = foundEntity.location;
    }
    
    var nearbyAnimals = spaceDatabase.filter( (e, _i, _a) => {
        return (e.type == "space_animal" && calculateDistance(e.location, cowboyLocation) <= lassoLength)
    });
    
    var responseAnimals = nearbyAnimals.map( e => {
        if (e.type == "space_animal") {
            return {type: e.metadata.type, location: e.location}
        }
    });

    res.json({space_animals: responseAnimals});
})

function calculateDistance(animal: location, cowboy: location): number {
    let distance = Math.sqrt((animal.x - cowboy.x)**2 + (animal.y - cowboy.y)**2);
    return distance;
}

app.listen(8080);

// Checks /entities JSON entities are of correct type and format
function containsInvalidEntities(entities: spaceEntity[]): boolean {
    
    let invalid = false

    entities.forEach((e) => {
        
        // Check if any attributes are null
        if (e.type == null || e.type == undefined || typeof(e.type) !== 'string') { invalid = true; return; }
        if (e.metadata == null && e.metadata == undefined) { invalid = true; return; }
        
        if (e.type == 'space_cowboy') {
            if (e.metadata.name == null && e.metadata.name == undefined || typeof(e.metadata.name) !== 'string') { invalid = true; return; }
            if (e.metadata.lassoLength == null && e.metadata.lassoLength == undefined || typeof(e.metadata.lassoLength) !== 'number') { invalid = true; return; }
        }
        if (e.type == 'space_animal') {
            if (e.metadata.type == null && e.metadata.type == undefined || typeof(e.metadata.type) !== 'string') { invalid = true; return; }
        }
        if (e.type !== 'space_animal' && e.type !== 'space_cowboy' || typeof(e.type) !== 'string') { invalid = true; return; }

        if (e.location == null && e.location == undefined) { invalid = true; return; }
        if (e.location.x == null && e.location.x == undefined || typeof(e.location.x) !== 'number') { invalid = true; return; }
        if (e.location.y == null && e.location.y == undefined || typeof(e.location.y) !== 'number') { invalid = true; return; }
    })

    return invalid;
}

function containsInvalidCowboy(req: lassoableRequest): boolean {

    let invalid = false;

    if (req.cowboy_name == null && req.cowboy_name == undefined || typeof(req.cowboy_name) !== 'string') { invalid = true; }

    return invalid;
}