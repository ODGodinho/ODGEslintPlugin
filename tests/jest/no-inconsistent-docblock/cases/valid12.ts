class Classe {

    /**
     * Request intercept.
     *
     * @param {undefined | number} page pagina para interceptar
     * @returns {Promise<number>}
     */
    public async requestIntercept(page?: number): Promise<number> {
        return page || 1;
    }

}
