import axios from "axios";
import { config } from "../../../config";
import ApiError from "../../errors/ApiError";
import httpStatus from "http-status";

const initPayment = async (paymentData: any) => {
    const data = {
        store_id: config.ssl.store_id,
        store_passwd: config.ssl.store_pass,
        total_amount: paymentData.amount,
        currency: 'BDT',
        tran_id: paymentData.transactionId, // use unique tran_id for each api call
        success_url: config.ssl.success_url,
        fail_url: config.ssl.fail_url,
        cancel_url: config.ssl.cancel_url,
        ipn_url: 'http://localhost:3030/ipn',
        shipping_method: 'N/A',
        product_name: 'Service.',
        product_category: 'Service',
        product_profile: 'general',
        cus_name: paymentData.appointment.patient.name,
        cus_email: paymentData.appointment.patient.email,
        cus_add1: 'Dhaka',
        cus_add2: 'Dhaka',
        cus_city: 'Dhaka',
        cus_state: 'Dhaka',
        cus_postcode: '1000',
        cus_country: 'Bangladesh',
        cus_phone: paymentData.appointment.patient.contactNumber,
        cus_fax: '01711111111',
        ship_name: 'N/A',
        ship_add1: 'N/A',
        ship_add2: 'N/A',
        ship_city: 'N/A',
        ship_state: 'N/A',
        ship_postcode: 1000,
        ship_country: 'Bangladesh',
    };


    const response = await axios({
        method: "POST",
        url: config.ssl.ssl_payment_api,
        data: data,
        headers: { "Content-Type": "application/x-www-form-urlencoded" }

    })

    return response
}

const validatePayment = async (payload: any) => {
    try {
        const response = await axios({
            method: "GET",
            url: `${config.ssl.ssl_validation_api}?val_id=${payload.val_id}&store_id=${config.ssl.store_id}&store_passwd=${config.ssl.store_pass}&format=json`
        })
    
       return response.data
    } catch (error) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Payment validation failed!")
    }

}

export const sslServices = {
    initPayment,
    validatePayment
}