package com.ecommerce.repository;

import com.ecommerce.model.UserAddressMongo;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;

public interface UserAddressMongoRepository extends MongoRepository<UserAddressMongo, String> {

    Optional<UserAddressMongo> findByUserId(Long userId);
}
