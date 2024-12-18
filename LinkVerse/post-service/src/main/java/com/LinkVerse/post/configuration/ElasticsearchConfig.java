//package com.LinkVerse.post.configuration;
//
//
//import org.springframework.context.annotation.Configuration;
//import org.springframework.data.elasticsearch.client.ClientConfiguration;
//import org.springframework.data.elasticsearch.client.elc.ElasticsearchConfiguration;
//
//@Configuration
//public class ElasticsearchConfig extends ElasticsearchConfiguration {
//
//
//    @Override
//    public ClientConfiguration clientConfiguration() {
//        return ClientConfiguration.builder()
//                .connectedTo("localhost:9200")
//                .usingSsl("e4ca53f962fc38af466aeb491f9e9c8ede4e2a74391359fc915a4388a375b8d6")
//                .withBasicAuth("elastic", "C_t3PI9-p8el3ijI+FLr")
//                .build();
//    }
//}