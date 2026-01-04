package com.odisha.handloom.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import java.util.List;

@Data
public class IndiaPostResponse {
    @JsonProperty("Message")
    private String message;

    @JsonProperty("Status")
    private String status;

    @JsonProperty("PostOffice")
    private List<PostOffice> postOffice;

    @Data
    public static class PostOffice {
        @JsonProperty("Name")
        private String name;

        @JsonProperty("Description")
        private String description;

        @JsonProperty("BranchType")
        private String branchType;

        @JsonProperty("DeliveryStatus")
        private String deliveryStatus;

        @JsonProperty("Circle")
        private String circle;

        @JsonProperty("District")
        private String district;

        @JsonProperty("Division")
        private String division;

        @JsonProperty("Region")
        private String region;

        @JsonProperty("Block")
        private String block;

        @JsonProperty("State")
        private String state;

        @JsonProperty("Country")
        private String country;

        @JsonProperty("Pincode")
        private String pincode;
    }
}
