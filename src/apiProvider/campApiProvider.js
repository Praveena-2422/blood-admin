import apiClient from "../network/apiClient";

class CampApiProvider {

    async getCampsData() {
        try {
            const response = await apiClient.get(`/camps`);

            if (response.status === 200 || response.status === 201) {
                return { status: true, response: response.data };
            } else {
                console.error("Failed to fetch categories:", response.data?.message ?? "Something went wrong");
                return { status: false, response: response.data };
            }
        } catch (error) {
            console.error("Error fetching category:", error);

            if (error.response && error.response.status === 401) {
                console.error("Unauthorized access - check your token.");
                console.error("Error Response:", error.response.data);
            }

            return { status: false, response: error.response?.data ?? null };
        }
    }

    async login(input) {
        try {
            const response = await apiClient.post(`/user-login`, input);
            console.log(response, "response");


            if (response.status === 200 || response.status === 201) {
                return { status: true, response: response.data };
            } else {
                console.log("enter");

                // console.error("Failed to fetch categories:", response.data?.message ?? "Something went wrong");
                return { status: false, response: response, message: response.message ?? "" };
            }       
        } catch (error) {
            console.error("Error fetching category:", error);

            if (error.response && error.response.status === 401) {
                console.error("Unauthorized access - check your token.");
                console.error("Error Response:", error.response.data);
            }

            return { status: false, response: error ?? null };
        }
    }

    // async getUserById(input) {
    //     try {
    //         const response = await apiClient.get(`/users/${input}`);

    //         if (response.status === 200 || response.status === 201) {
    //             return { status: true, response: response.data };
    //         } else {
    //             console.error("Failed to fetch categories:", response.data?.message ?? "Something went wrong");
    //             return { status: false, response: response.data };
    //         }
    //     } catch (error) {
    //         console.error("Error fetching category:", error);

    //         if (error.response && error.response.status === 401) {
    //             console.error("Unauthorized access - check your token.");
    //             console.error("Error Response:", error.response.data);
    //         }

    //         return { status: false, response: error.response?.data ?? null };
    //     }
    // }


    // async updateUser(id, input) {
    //     try {
    //         const response = await apiClient.put(`/users/${id}`, input);

    //         if (response.status === 200 || response.status === 201) {
    //             return { status: true, response: response.data };
    //         } else {
    //             console.error("Failed to fetch categories:", response.data?.message ?? "Something went wrong");
    //             return { status: false, response: response.data };
    //         }
    //     } catch (error) {
    //         console.error("Error fetching category:", error);

    //         if (error.response && error.response.status === 401) {
    //             console.error("Unauthorized access - check your token.");
    //             console.error("Error Response:", error.response.data);
    //         }

    //         return { status: false, response: error.response?.data ?? null };
    //     }
    // }


    // async deleteUser(input) {
    //     try {
    //         const response = await apiClient.delete(`/users/${input}`);

    //         if (response.status === 200 || response.status === 201) {
    //             return { status: true, response: response.data };
    //         } else {
    //             console.error("Failed to fetch categories:", response.data?.message ?? "Something went wrong");
    //             return { status: false, response: response.data };
    //         }
    //     } catch (error) {
    //         console.error("Error fetching category:", error);

    //         if (error.response && error.response.status === 401) {
    //             console.error("Unauthorized access - check your token.");
    //             console.error("Error Response:", error.response.data);
    //         }

    //         return { status: false, response: error.response?.data ?? null };
    //     }
    // }


}
const campApiProvider = new CampApiProvider()
export default campApiProvider