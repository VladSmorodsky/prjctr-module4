let util = require('util');

const database = {
    getUser: (id, callback) => {
        const users = [{
            id: 1,
            name: 'Robert',
        }, {
            id: 2,
            name: 'John'
        }];
        
        const user = users.find((user) => user.id === id);
        if (!user) {
            callback(`User with id=${id} not found`);
        } else {
            callback(null, user);
        }
    },
    getUsersBook: (userId, callback) => {
        const usersBooks = {
            1: [],
            2: [1, 2],
        };

        const userBook = usersBooks[userId];
        if (!userBook) {
            callback(`Set of books related to userId=${userId} not found`);
        } else {
            callback(null, userBook);
        }
    },
    buyBook: (id, callback) => {
        const books = [{
            id: 1,
            name: 'Art of war'
        }, {
            id: 2,
            name: 'Hunger games'
        }, {
            id: 3,
            name: '1984'
        }];

        const book = books.find((book) => book.id === id);
        if (!book) {
            callback(`Book with id=${id} not found`);
        } else {
            callback(null, true);
        }
    },
};


const getUserPromisify = util.promisify(database.getUser);
const getUserBooksPromisify = util.promisify(database.getUsersBook);
const buyBookPromisify = util.promisify(database.buyBook);

const buyBookForUser = async (bookId, userId) => {
    let buyBookObj = {
        error: null,
        message: undefined
    };
    try {
        let user = await getUserPromisify(userId);
        let userBooks = await getUserBooksPromisify(userId);
        if (userBooks.includes(bookId)) {
            buyBookObj.error = `User already has book with id=${bookId}`;
            return buyBookObj;
        }
        await buyBookPromisify(bookId);

        buyBookObj.message = 'Success';
        return buyBookObj;

    } catch (err) {
        buyBookObj.error = err;
        return buyBookObj;
    }
}

buyBookForUser(1,1).then( obj => console.log(obj) );

buyBookForUser(1,2).then( obj => console.log(obj) );
// 'User already has book with id=1'
// undefined

buyBookForUser(3,2).then( obj => console.log(obj) );

buyBookForUser(5,2).then( obj => console.log(obj) );
// 'Book with id=5 not found'
// undefined

buyBookForUser(1,3).then( obj => console.log(obj) );
// 'User with id=3 not found'
// undefined