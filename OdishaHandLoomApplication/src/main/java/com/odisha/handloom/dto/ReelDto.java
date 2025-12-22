package com.odisha.handloom.dto;

public class ReelDto {
    private String id;
    private String videoUrl;
    private java.util.UUID productId;
    private String productName;
    private java.math.BigDecimal price;
    private String thumbnailUrl;
    private String caption;
    private java.util.UUID sellerId;
    private String sellerName;
    private long likes;
    private long comments;

    public ReelDto() {
    }

    public ReelDto(String id, String videoUrl, java.util.UUID productId, String productName, java.math.BigDecimal price,
            String thumbnailUrl, String caption, java.util.UUID sellerId, String sellerName, long likes,
            long comments) {
        this.id = id;
        this.videoUrl = videoUrl;
        this.productId = productId;
        this.productName = productName;
        this.price = price;
        this.thumbnailUrl = thumbnailUrl;
        this.caption = caption;
        this.sellerId = sellerId;
        this.sellerName = sellerName;
        this.likes = likes;
        this.comments = comments;
    }

    // Builder manual implementation for compatibility
    public static class ReelDtoBuilder {
        private String id;
        private String videoUrl;
        private java.util.UUID productId;
        private String productName;
        private java.math.BigDecimal price;
        private String thumbnailUrl;
        private String caption;
        private java.util.UUID sellerId;
        private String sellerName;
        private long likes;
        private long comments;

        public ReelDtoBuilder id(String id) {
            this.id = id;
            return this;
        }

        public ReelDtoBuilder videoUrl(String videoUrl) {
            this.videoUrl = videoUrl;
            return this;
        }

        public ReelDtoBuilder productId(java.util.UUID productId) {
            this.productId = productId;
            return this;
        }

        public ReelDtoBuilder productName(String productName) {
            this.productName = productName;
            return this;
        }

        public ReelDtoBuilder price(java.math.BigDecimal price) {
            this.price = price;
            return this;
        }

        public ReelDtoBuilder thumbnailUrl(String thumbnailUrl) {
            this.thumbnailUrl = thumbnailUrl;
            return this;
        }

        public ReelDtoBuilder caption(String caption) {
            this.caption = caption;
            return this;
        }

        public ReelDtoBuilder sellerId(java.util.UUID sellerId) {
            this.sellerId = sellerId;
            return this;
        }

        public ReelDtoBuilder sellerName(String sellerName) {
            this.sellerName = sellerName;
            return this;
        }

        public ReelDtoBuilder likes(long likes) {
            this.likes = likes;
            return this;
        }

        public ReelDtoBuilder comments(long comments) {
            this.comments = comments;
            return this;
        }

        public ReelDto build() {
            return new ReelDto(id, videoUrl, productId, productName, price, thumbnailUrl, caption, sellerId, sellerName,
                    likes, comments);
        }
    }

    public static ReelDtoBuilder builder() {
        return new ReelDtoBuilder();
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getVideoUrl() {
        return videoUrl;
    }

    public void setVideoUrl(String videoUrl) {
        this.videoUrl = videoUrl;
    }

    public java.util.UUID getProductId() {
        return productId;
    }

    public void setProductId(java.util.UUID productId) {
        this.productId = productId;
    }

    // Getters and Setters omitted for brevity in prompt but implemented in full
    // code if needed.
    // Assuming full POJO is needed.
    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public java.math.BigDecimal getPrice() {
        return price;
    }

    public void setPrice(java.math.BigDecimal price) {
        this.price = price;
    }

    public String getThumbnailUrl() {
        return thumbnailUrl;
    }

    public void setThumbnailUrl(String thumbnailUrl) {
        this.thumbnailUrl = thumbnailUrl;
    }

    public String getCaption() {
        return caption;
    }

    public void setCaption(String caption) {
        this.caption = caption;
    }

    public java.util.UUID getSellerId() {
        return sellerId;
    }

    public void setSellerId(java.util.UUID sellerId) {
        this.sellerId = sellerId;
    }

    public String getSellerName() {
        return sellerName;
    }

    public void setSellerName(String sellerName) {
        this.sellerName = sellerName;
    }

    public long getLikes() {
        return likes;
    }

    public void setLikes(long likes) {
        this.likes = likes;
    }

    public long getComments() {
        return comments;
    }

    public void setComments(long comments) {
        this.comments = comments;
    }
}
