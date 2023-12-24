db.createUser(
    {
        user: 'joni',
        pwd: 'joni89db',
        roles: [
            {
                role: 'readWrite',
                db: 'budgetDb'
            }
        ]
    }
)