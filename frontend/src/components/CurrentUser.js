/**
 *  Main Function for CurrentUser Component
 * 
 */
export default class CurrentUser{
    
    constructor() {
        this.loginStatus = false
        this.userId = null
        this.username = null
        this.authLevel = null
    }

    /**
     * Returns information about the current user
     * 
     * @returns A collection of current user's attributes
     */
    getCurrentUser() {
        return {userId: this.userId, username: this.username, authLevel: this.authLevel}
    }

    /**
     * Sets the current user
     * 
     * @param {Int} userIdParam - The userId 
     * @param {String} usernameParam - The Username
     * @param {String} authLevelParam - The Authorization Level for the user
     */
    putCurrentUser(userIdParam, usernameParam, authLevelParam) {

        // Raise a type error if any of the fields are missing
        if (userIdParam == null || usernameParam == null || authLevelParam == null)
            throw TypeError("None of the fields can be empty")
        
        // Set user attributes
        this.userId = userIdParam
        this.username = usernameParam
        this.authLevel = authLevelParam

        // Set login status to true
        this.loginStatus = true
    }

    /**
     * Check whether there's a current user logged in or not
     * 
     * @returns {Boolean} - Current User Status
     */
    checkLoggedInStatus() {
        return this.loginStatus
    }
}