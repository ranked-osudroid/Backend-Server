import mongoose from 'mongoose';

export default class MongoDB {
    static connect() {
        console.log(`Starting to connect MongoDB...`);

        mongoose.set('debug', true);
    
        mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true
        }, error => {
            if(error) {
                console.log(`Failed to connect MongoDB!`, error);
            }
            else {
                console.log(`Successfully connected to MongoDB!`);
            }
        });
    }
}

mongoose.connection.on('error', error => {
    console.error(`An error has occurred while connecting to MongoDB.`, error);
});

mongoose.connection.on('disconnected', () => {
    console.log(`The connection was disconnected. Try reconnecting...`);
    MongoDB.connect();
});