package com.LinkVerse.post.configuration;


import org.springframework.context.annotation.Configuration;
import org.springframework.data.elasticsearch.client.ClientConfiguration;
import org.springframework.data.elasticsearch.client.elc.ElasticsearchConfiguration;

@Configuration
public class ElasticsearchConfig extends ElasticsearchConfiguration {


    @Override
    public ClientConfiguration clientConfiguration() {
        return ClientConfiguration.builder()
                .connectedTo("localhost:9200")
                .usingSsl("44caefe62738a8d3e1f16438d75c37dee6487b4e9673a0cbe1ea2af05dfcc5ab")
                .withBasicAuth("elastic", "8Ec6DicCdSj+lNJySSii")
                .build();
    }
}